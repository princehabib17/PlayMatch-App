import sql from "@/app/api/utils/sql.js";

// GET /api/games - List games with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;
    const skillLevel = searchParams.get("skillLevel");
    const venueId = searchParams.get("venueId");
    const status = searchParams.get("status") || "open";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let query = `
      SELECT 
        g.*,
        v.name as venue_name,
        v.location as venue_location,
        v.image_url as venue_image,
        v.latitude,
        v.longitude,
        u.name as organizer_name,
        u.avatar_url as organizer_avatar,
        COUNT(gp.id) as players_joined
      FROM games g
      LEFT JOIN venues v ON g.venue_id = v.id
      LEFT JOIN users u ON g.organizer_id = u.id
      LEFT JOIN game_participants gp ON g.id = gp.game_id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND g.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (skillLevel) {
      query += ` AND g.skill_level = $${paramIndex}`;
      values.push(skillLevel);
      paramIndex++;
    }

    if (venueId) {
      query += ` AND g.venue_id = $${paramIndex}`;
      values.push(parseInt(venueId));
      paramIndex++;
    }

    if (dateFrom) {
      query += ` AND g.datetime_start >= $${paramIndex}`;
      values.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      query += ` AND g.datetime_start <= $${paramIndex}`;
      values.push(dateTo);
      paramIndex++;
    }

    query += `
      GROUP BY g.id, v.id, u.id
      ORDER BY g.datetime_start ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const games = await sql(query, values);

    // Transform data to match frontend expectations
    const transformedGames = games.map((game) => ({
      id: game.id,
      title: game.title,
      venue: game.venue_name,
      venueImage: game.venue_image,
      dateTime: game.datetime_start,
      fee: parseFloat(game.fee_per_player),
      level: game.skill_level,
      playersJoined: parseInt(game.players_joined),
      maxPlayers: game.max_players,
      status: game.status,
      description: game.description,
      organizer: game.organizer_name,
      location: {
        name: game.venue_location,
        latitude: game.latitude ? parseFloat(game.latitude) : null,
        longitude: game.longitude ? parseFloat(game.longitude) : null,
      },
    }));

    return Response.json({
      games: transformedGames,
      total: transformedGames.length,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return Response.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

// POST /api/games - Create a new game
export async function POST(request) {
  try {
    const {
      title,
      venueId,
      organizerId,
      datetimeStart,
      durationMinutes = 90,
      feePerPlayer = 0,
      maxPlayers,
      skillLevel,
      gameType = "casual",
      description,
      rules,
    } = await request.json();

    // Validate required fields
    if (!venueId || !organizerId || !datetimeStart || !maxPlayers) {
      return Response.json(
        {
          error:
            "Missing required fields: venueId, organizerId, datetimeStart, maxPlayers",
        },
        { status: 400 },
      );
    }

    const [game] = await sql`
      INSERT INTO games (
        title, venue_id, organizer_id, datetime_start, duration_minutes,
        fee_per_player, max_players, skill_level, game_type, description, rules
      ) VALUES (
        ${title}, ${venueId}, ${organizerId}, ${datetimeStart}, ${durationMinutes},
        ${feePerPlayer}, ${maxPlayers}, ${skillLevel}, ${gameType}, ${description}, ${rules}
      )
      RETURNING *
    `;

    return Response.json({ game }, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return Response.json({ error: "Failed to create game" }, { status: 500 });
  }
}
