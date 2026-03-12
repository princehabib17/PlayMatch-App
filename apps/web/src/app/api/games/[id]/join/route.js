import { getAuthenticatedUserId } from "../../../utils/auth.js";
import sql from "../../../utils/sql.js";

function parseRouteId(rawId) {
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

// POST /api/games/[id]/join - Join a game
export async function POST(request, { params }) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gameId = parseRouteId(params.id);
    if (!gameId) {
      return Response.json({ error: "Invalid game id" }, { status: 400 });
    }

    const { team, position } = await request.json();

    const [result] = await sql(
      `
      WITH locked_game AS (
        SELECT id, status, max_players
        FROM games
        WHERE id = $1
        FOR UPDATE
      ),
      existing_participant AS (
        SELECT 1 AS found
        FROM game_participants
        WHERE game_id = $1 AND user_id = $2
      ),
      current_count AS (
        SELECT COUNT(*)::int AS current_participants
        FROM game_participants
        WHERE game_id = $1
      ),
      inserted_participant AS (
        INSERT INTO game_participants (game_id, user_id, team, "position", payment_status)
        SELECT $1, $2, $3, $4, 'pending'
        FROM locked_game lg
        CROSS JOIN current_count cc
        WHERE lg.status = 'open'
          AND cc.current_participants < lg.max_players
          AND NOT EXISTS (SELECT 1 FROM existing_participant)
        RETURNING *
      ),
      status_update AS (
        UPDATE games
        SET status = 'full', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND status = 'open'
          AND (SELECT COUNT(*) FROM game_participants WHERE game_id = $1) >= max_players
        RETURNING id
      )
      SELECT
        (SELECT row_to_json(ip) FROM inserted_participant ip) AS participant,
        (SELECT status FROM locked_game) AS game_status,
        (SELECT current_participants FROM current_count) AS current_participants,
        (SELECT max_players FROM locked_game) AS max_players,
        EXISTS(SELECT 1 FROM existing_participant) AS already_joined,
        EXISTS(SELECT 1 FROM locked_game) AS game_exists;
      `,
      [gameId, userId, team || null, position || null],
    );

    if (!result.game_exists) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    if (result.participant) {
      return Response.json(
        {
          participant: result.participant,
          message: "Successfully joined the game",
        },
        { status: 201 },
      );
    }

    if (result.already_joined) {
      return Response.json(
        { error: "User is already registered for this game" },
        { status: 400 },
      );
    }

    if (result.game_status !== "open") {
      return Response.json(
        { error: "Game is not open for registration" },
        { status: 400 },
      );
    }

    if (result.current_participants >= result.max_players) {
      return Response.json({ error: "Game is full" }, { status: 400 });
    }

    return Response.json({ error: "Failed to join game" }, { status: 500 });
  } catch (error) {
    console.error("Error joining game:", error);

    if (error.code === "23505") {
      return Response.json(
        { error: "User is already registered for this game" },
        { status: 400 },
      );
    }

    return Response.json({ error: "Failed to join game" }, { status: 500 });
  }
}

// DELETE /api/games/[id]/join - Leave a game
export async function DELETE(request, { params }) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gameId = parseRouteId(params.id);
    if (!gameId) {
      return Response.json({ error: "Invalid game id" }, { status: 400 });
    }

    const [participant] = await sql`
      SELECT gp.*, g.status as game_status, g.datetime_start
      FROM game_participants gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.game_id = ${gameId} AND gp.user_id = ${userId}
    `;

    if (!participant) {
      return Response.json(
        { error: "User is not registered for this game" },
        { status: 404 },
      );
    }

    if (
      participant.game_status === "in_progress" ||
      participant.game_status === "completed"
    ) {
      return Response.json(
        { error: "Cannot leave a game that has already started" },
        { status: 400 },
      );
    }

    const gameTime = new Date(participant.datetime_start);
    const now = new Date();
    const hoursUntilGame = (gameTime - now) / (1000 * 60 * 60);

    if (hoursUntilGame < 2) {
      return Response.json(
        { error: "Cannot leave within 2 hours of game time" },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM game_participants
      WHERE game_id = ${gameId} AND user_id = ${userId}
    `;

    await sql`
      UPDATE games 
      SET status = 'open', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${gameId} AND status = 'full'
    `;

    return Response.json({
      message: "Successfully left the game",
    });
  } catch (error) {
    console.error("Error leaving game:", error);
    return Response.json({ error: "Failed to leave game" }, { status: 500 });
  }
}
