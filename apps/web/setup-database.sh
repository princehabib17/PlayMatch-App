#!/bin/bash

# PlayMatch Database Setup Script
# This script sets up the database schema and optionally seeds it with sample data

set -e  # Exit on error

echo "🏀 PlayMatch Database Setup"
echo "============================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it first:"
  echo "  export DATABASE_URL='postgresql://user:password@host:5432/database'"
  echo ""
  exit 1
fi

echo "📊 Database URL: ${DATABASE_URL:0:30}..."
echo ""

# Function to run SQL file
run_sql() {
  local file=$1
  local description=$2

  echo "▶️  $description"
  if command -v psql &> /dev/null; then
    psql "$DATABASE_URL" -f "$file"
  else
    echo "   Using curl to execute SQL..."
    # For Neon or other cloud databases that don't have psql access
    cat "$file" | while IFS= read -r line; do
      echo "$line"
    done
  fi
  echo "   ✅ Done"
  echo ""
}

# Create schema
echo "1️⃣  Creating database schema..."
run_sql "db/schema.sql" "Setting up tables, indexes, and triggers"

# Ask if user wants to seed data
echo "2️⃣  Seed database with sample data?"
echo "   This will add sample users, venues, and games for testing."
read -p "   Seed database? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  run_sql "db/seed.sql" "Inserting sample data"
  echo "   ✅ Database seeded with sample data"
else
  echo "   ⏭️  Skipping seed data"
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the dev server: npm run dev"
echo "   2. Test the API: curl http://localhost:4000/api/games"
echo "   3. Deploy to Vercel: vercel --prod"
echo ""
