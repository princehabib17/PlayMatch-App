import sql from "@/app/api/utils/sql.js";

// POST /api/games/[id]/join - Join a game
export async function POST(request, { params }) {
  try {
    const gameId = parseInt(params.id);
    const { userId, team, position } = await request.json();

    if (!userId) {
      return Response.json(
        { error: "Missing required field: userId" },
        { status: 400 },
      );
    }

    // Check if game exists and is open
    const [game] = await sql`
      SELECT 
        g.*,
        COUNT(gp.id) as current_participants
      FROM games g
      LEFT JOIN game_participants gp ON g.id = gp.game_id
      WHERE g.id = ${gameId}
      GROUP BY g.id
    `;

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.status !== "open") {
      return Response.json(
        { error: "Game is not open for registration" },
        { status: 400 },
      );
    }

    if (game.current_participants >= game.max_players) {
      return Response.json({ error: "Game is full" }, { status: 400 });
    }

    // Check if user is already in this game
    const [existingParticipant] = await sql`
      SELECT id FROM game_participants
      WHERE game_id = ${gameId} AND user_id = ${userId}
    `;

    if (existingParticipant) {
      return Response.json(
        { error: "User is already registered for this game" },
        { status: 400 },
      );
    }

    // Add user to the game
    const [participant] = await sql`
      INSERT INTO game_participants (game_id, user_id, team, "position", payment_status)
      VALUES (${gameId}, ${userId}, ${team || null}, ${position || null}, 'pending')
      RETURNING *
    `;

    // Update game status if it's now full
    const newParticipantCount = game.current_participants + 1;
    if (newParticipantCount >= game.max_players) {
      await sql`
        UPDATE games 
        SET status = 'full', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${gameId}
      `;
    }

    return Response.json(
      {
        participant,
        message: "Successfully joined the game",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error joining game:", error);

    // Handle unique constraint violation
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
    const gameId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "Missing required parameter: userId" },
        { status: 400 },
      );
    }

    // Check if user is in the game
    const [participant] = await sql`
      SELECT gp.*, g.status as game_status, g.datetime_start
      FROM game_participants gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.game_id = ${gameId} AND gp.user_id = ${parseInt(userId)}
    `;

    if (!participant) {
      return Response.json(
        { error: "User is not registered for this game" },
        { status: 404 },
      );
    }

    // Don't allow leaving if game has already started
    if (
      participant.game_status === "in_progress" ||
      participant.game_status === "completed"
    ) {
      return Response.json(
        { error: "Cannot leave a game that has already started" },
        { status: 400 },
      );
    }

    // Check if it's too close to game time (e.g., within 2 hours)
    const gameTime = new Date(participant.datetime_start);
    const now = new Date();
    const hoursUntilGame = (gameTime - now) / (1000 * 60 * 60);

    if (hoursUntilGame < 2) {
      return Response.json(
        { error: "Cannot leave within 2 hours of game time" },
        { status: 400 },
      );
    }

    // Remove user from the game
    await sql`
      DELETE FROM game_participants
      WHERE game_id = ${gameId} AND user_id = ${parseInt(userId)}
    `;

    // Update game status back to open if it was full
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
