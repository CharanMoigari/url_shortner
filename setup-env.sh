#!/bin/bash

# Configuration Generator Script
# Generates secure values for production use

echo "🔐 URL Shortener Configuration Generator"
echo "======================================="
echo ""

# Generate JWT Secret
echo "1️⃣ Generating JWT Secret..."
JWT_SECRET=$(openssl rand -hex 32)
echo "   JWT_SECRET=$JWT_SECRET"
echo ""

# Generate random password
echo "2️⃣ Generating Database Password..."
DB_PASSWORD=$(openssl rand -base64 32)
echo "   DB_PASSWORD=$DB_PASSWORD"
echo ""

# Function to ask user for input
read_config() {
  local prompt=$1
  local default=$2
  local var_name=$3
  
  read -p "$prompt (default: $default): " value
  value=${value:-$default}
  eval "$var_name='$value'"
}

# Gather configuration
echo "📝 Configure Your Application"
echo "=============================="
echo ""

read_config "Environment (development/production)" "production" "NODE_ENV"
read_config "Backend Port" "3000" "PORT"
read_config "Database Host" "localhost" "DB_HOST"
read_config "Database Port" "5432" "DB_PORT"
read_config "Database Name" "url_shortener" "DB_NAME"
read_config "Database User" "postgres" "DB_USER"
read_config "Redis Host" "localhost" "REDIS_HOST"
read_config "Redis Port" "6379" "REDIS_PORT"
read_config "RabbitMQ URL" "amqp://guest:guest@localhost:5672" "RABBITMQ_URL"
read_config "CORS Origin" "http://localhost:5173" "CORS_ORIGIN"
read_config "Base URL" "http://localhost:3000" "BASE_URL"
read_config "Log Level (debug/info/warn/error)" "info" "LOG_LEVEL"

# Generate .env file
ENV_FILE="backend/.env"

cat > "$ENV_FILE" << EOF
# ================================================
# URL Shortener Configuration
# Generated: $(date)
# ================================================

# Server Configuration
PORT=$PORT
NODE_ENV=$NODE_ENV

# PostgreSQL Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_POOL_SIZE=10

# Redis Cache Configuration
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
REDIS_DB=0
REDIS_PASSWORD=

# JWT Authentication Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# RabbitMQ Message Queue Configuration
RABBITMQ_URL=$RABBITMQ_URL

# Application URLs Configuration
APP_URL=http://$DB_HOST:$PORT
BASE_URL=$BASE_URL
CORS_ORIGIN=$CORS_ORIGIN

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=$LOG_LEVEL
LOG_DIR=./logs
EOF

echo ""
echo "✅ Configuration saved to: $ENV_FILE"
echo ""
echo "📋 Generated Values:"
echo "   JWT_SECRET: $JWT_SECRET"
echo "   DB_PASSWORD: $DB_PASSWORD"
echo ""
echo "⚠️  Keep these values safe!"
echo ""
