# Configuration Generator Script (Windows)
# Generates secure values for production use

Write-Host "🔐 URL Shortener Configuration Generator" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Generate JWT Secret (using random bytes)
Write-Host "1️⃣ Generating JWT Secret..." -ForegroundColor Yellow
$JWT_SECRET = -join ((0..31) | ForEach-Object { "{0:x}" -f (Get-Random -Maximum 16) })
Write-Host "   JWT_SECRET=$JWT_SECRET" -ForegroundColor Green
Write-Host ""

# Generate random database password
Write-Host "2️⃣ Generating Database Password..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$DB_PASSWORD = [Convert]::ToBase64String($bytes)
Write-Host "   DB_PASSWORD=$DB_PASSWORD" -ForegroundColor Green
Write-Host ""

# Function to get user input with default
function Get-UserInput {
    param(
        [string]$Prompt,
        [string]$Default
    )
    
    $response = Read-Host "$Prompt (default: $Default)"
    if ([string]::IsNullOrEmpty($response)) {
        return $Default
    }
    return $response
}

# Gather configuration
Write-Host "📝 Configure Your Application" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$NODE_ENV = Get-UserInput "Environment (development/production)" "production"
$PORT = Get-UserInput "Backend Port" "3000"
$DB_HOST = Get-UserInput "Database Host" "localhost"
$DB_PORT = Get-UserInput "Database Port" "5432"
$DB_NAME = Get-UserInput "Database Name" "url_shortener"
$DB_USER = Get-UserInput "Database User" "postgres"
$REDIS_HOST = Get-UserInput "Redis Host" "localhost"
$REDIS_PORT = Get-UserInput "Redis Port" "6379"
$RABBITMQ_URL = Get-UserInput "RabbitMQ URL" "amqp://guest:guest@localhost:5672"
$CORS_ORIGIN = Get-UserInput "CORS Origin" "http://localhost:5173"
$BASE_URL = Get-UserInput "Base URL" "http://localhost:3000"
$LOG_LEVEL = Get-UserInput "Log Level (debug/info/warn/error)" "info"

# Generate .env file
$ENV_FILE = "backend\.env"

$content = @"
# ================================================
# URL Shortener Configuration
# Generated: $(Get-Date)
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
APP_URL=http://$DB_HOST`:$PORT
BASE_URL=$BASE_URL
CORS_ORIGIN=$CORS_ORIGIN

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=$LOG_LEVEL
LOG_DIR=./logs
"@

Set-Content -Path $ENV_FILE -Value $content

Write-Host ""
Write-Host "✅ Configuration saved to: $ENV_FILE" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Generated Values:" -ForegroundColor Cyan
Write-Host "   JWT_SECRET: $JWT_SECRET" -ForegroundColor Yellow
Write-Host "   DB_PASSWORD: $DB_PASSWORD" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Keep these values safe!" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start PostgreSQL, Redis, and RabbitMQ"
Write-Host "2. cd backend && npm install"
Write-Host "3. npm run migrate"
Write-Host "4. npm run dev"
