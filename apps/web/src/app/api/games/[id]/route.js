import sql from "@/app/api/utils/sql.js";

// GET /api/games/[id] - Get a single game with participants
export async function GET(request, { params }) {
  try {
    const gameId = parseInt(params.id);

    // Get game details with venue and organizer info
    const [game] = await sql`
      SELECT 
        g.*,
        v.name as venue_name,
        v.location as venue_location,
        v.image_url as venue_image,
        v.latitude,
        v.longitude,
        v.description as venue_description,
        u.name as organizer_name,
        u.avatar_url as organizer_avatar
      FROM games g
      LEFT JOIN venues v ON g.venue_id = v.id
      LEFT JOIN users u ON g.organizer_id = u.id
      WHERE g.id = ${gameId}
    `;

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    // Get participants with their team assignments
    const participants = await sql`
      SELECT 
        gp.*,
        u.name,
        u.avatar_url,
        u.rating,
        u.games_played
      FROM game_participants gp
      LEFT JOIN users u ON gp.user_id = u.id
      WHERE gp.game_id = ${gameId}
      ORDER BY gp.team, gp.joined_at
    `;

    // Organize participants by teams
    const teamA = participants.filter((p) => p.team === "A");
    const teamB = participants.filter((p) => p.team === "B");
    const unassigned = participants.filter((p) => !p.team);

    const transformedGame = {
      id: game.id,
      title: game.title,
      venue: {
        id: game.venue_id,
        name: game.venue_name,
        location: game.venue_location,
        image: game.venue_image,
        description: game.venue_description,
        latitude: parseFloat(game.latitude),
        longitude: parseFloat(game.longitude),
      },
      organizer: {
        id: game.organizer_id,
        name: game.organizer_name,
        avatar: game.organizer_avatar,
      },
      dateTime: game.datetime_start,
      duration: game.duration_minutes,
      fee: parseFloat(game.fee_per_player),
      maxPlayers: game.max_players,
      level: game.skill_level,
      gameType: game.game_type,
      description: game.description,
      rules: game.rules,
      status: game.status,
      teams: {
        A: teamA.map((p) => ({
          id: p.user_id,
          name: p.name,
          avatar: p.avatar_url,
          position: p.position,
          paymentStatus: p.payment_status,
          rating: parseFloat(p.rating) || 0,
          gamesPlayed: p.games_played || 0,
        })),
        B: teamB.map((p) => ({
          id: p.user_id,
          name: p.name,
          avatar: p.avatar_url,
          position: p.position,
          paymentStatus: p.payment_status,
          rating: parseFloat(p.rating) || 0,
          gamesPlayed: p.games_played || 0,
        })),
        unassigned: unassigned.map((p) => ({
          id: p.user_id,
          name: p.name,
          avatar: p.avatar_url,
          position: p.position,
          paymentStatus: p.payment_status,
          rating: parseFloat(p.rating) || 0,
          gamesPlayed: p.games_played || 0,
        })),
      },
      playersJoined: participants.length,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    };

    return Response.json({ game: transformedGame });
  } catch (error) {
    console.error("Error fetching game:", error);
    return Response.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

// PUT /api/games/[id] - Update a game
export async function PUT(request, { params }) {
  try {
    const gameId = parseInt(params.id);
    const updates = await request.json();

    // Build dynamic update query
    const allowedFields = [
      "title",
      "venue_id",
      "datetime_start",
      "duration_minutes",
      "fee_per_player",
      "max_players",
      "skill_level",
      "game_type",
      "description",
      "rules",
      "status",
    ];

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      if (allowedFields.includes(snakeKey)) {
        updateFields.push(`${snakeKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(gameId);

    const query = `
      UPDATE games 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const [updatedGame] = await sql(query, values);

    if (!updatedGame) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    return Response.json({ game: updatedGame });
  } catch (error) {
    console.error("Error updating game:", error);
    return Response.json({ error: "Failed to update game" }, { status: 500 });
  }
}

// DELETE /api/games/[id] - Delete a game
export async function DELETE(request, { params }) {
  try {
    const gameId = parseInt(params.id);

    // Check if game exists and get organizer info
    const [game] = await sql`
      SELECT organizer_id, status
      FROM games 
      WHERE id = ${gameId}
    `;

    if (!game) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    // Only allow deletion if game hasn't started
    if (game.status === "in_progress" || game.status === "completed") {
      return Response.json(
        { error: "Cannot delete a game that has started or completed" },
        { status: 400 },
      );
    }

    // Delete the game (this will cascade to participants due to foreign keys)
    await sql`
      DELETE FROM games 
      WHERE id = ${gameId}
    `;

    return Response.json({
      message: "Game deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    return Response.json({ error: "Failed to delete game" }, { status: 500 });
  }
}
