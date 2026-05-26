#!/bin/bash

# Exit on any error
set -e

echo "======================================"
echo "Cleaning up old containers and images..."
echo "======================================"

# Stop and remove all containers, networks, and volumes defined in compose.yaml
if command -v podman-compose &> /dev/null; then
    COMPOSE_CMD="podman-compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="podman compose"
fi

$COMPOSE_CMD down -v

# Prune unused containers, images, and networks to free up space
podman system prune -f || true

echo ""
echo "======================================"
echo "Building and Starting Containers..."
echo "======================================"
$COMPOSE_CMD up --build -d

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
podman ps
echo ""
echo "Frontend is accessible at http://localhost:3000"
echo "Backend is accessible at http://localhost:8080"
echo "Database is accessible at localhost:3306"
echo "Redis is accessible at localhost:6379"
