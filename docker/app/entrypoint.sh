#!/bin/sh
set -e

# Video-n8n Application Entrypoint
# Handles initialization and graceful startup

echo "🚀 Starting Video-n8n application..."

# Create required directories if they don't exist
mkdir -p logs assets data/media data/assets data/finaldraft data/premiere

# Set proper ownership for non-root user
chown -R nodejs:nodejs logs assets data 2>/dev/null || true

# Wait for database to be ready (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ] && [ "$NODE_ENV" != "test" ]; then
  echo "⏳ Waiting for database connection..."
  
  # Extract host and port from DATABASE_URL for connection testing
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  
  if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    timeout=30
    until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null || [ $timeout -eq 0 ]; do
      echo "Waiting for database at $DB_HOST:$DB_PORT... ($timeout seconds remaining)"
      sleep 2
      timeout=$((timeout - 2))
    done
    
    if [ $timeout -eq 0 ]; then
      echo "⚠️  Database connection timeout. Starting anyway..."
    else
      echo "✅ Database connection established"
    fi
  fi
fi

# Wait for Redis to be ready (if REDIS_URL is set)
if [ -n "$REDIS_URL" ] && [ "$NODE_ENV" != "test" ]; then
  echo "⏳ Waiting for Redis connection..."
  
  # Extract host and port from REDIS_URL
  REDIS_HOST=$(echo $REDIS_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  REDIS_PORT=$(echo $REDIS_URL | sed -n 's/.*:\([0-9]*\).*/\1/p')
  
  # Handle simple redis://host:port format
  if [ -z "$REDIS_HOST" ]; then
    REDIS_HOST=$(echo $REDIS_URL | sed -n 's/redis:\/\/\([^:]*\):.*/\1/p')
    REDIS_PORT=$(echo $REDIS_URL | sed -n 's/redis:\/\/[^:]*:\([0-9]*\).*/\1/p')
  fi
  
  if [ -n "$REDIS_HOST" ] && [ -n "$REDIS_PORT" ]; then
    timeout=30
    until nc -z "$REDIS_HOST" "$REDIS_PORT" 2>/dev/null || [ $timeout -eq 0 ]; do
      echo "Waiting for Redis at $REDIS_HOST:$REDIS_PORT... ($timeout seconds remaining)"
      sleep 2
      timeout=$((timeout - 2))
    done
    
    if [ $timeout -eq 0 ]; then
      echo "⚠️  Redis connection timeout. Starting anyway..."
    else
      echo "✅ Redis connection established"
    fi
  fi
fi

echo "🎬 Starting Video-n8n application server..."

# Execute the main command
exec "$@"