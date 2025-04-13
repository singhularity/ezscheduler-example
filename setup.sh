#!/bin/bash

# Setup script for the complete example
echo "Setting up the Scheduler Widget Complete Example..."

# Install backend dependencies
echo "Installing Node.js backend dependencies..."
cd node-backend
npm install
echo "Backend dependencies installed successfully."

# Create data directory for backend
mkdir -p data
echo "Data directory created."

# Install Vite and other dependencies
npm install --legacy-peer-deps
npm install --save ../../../dist --legacy-peer-deps
echo "Frontend dependencies installed successfully."

# Build React frontend for production
echo "Building React frontend for production..."
npm run build
echo "Frontend built successfully."

echo "Setup complete!"
echo "To run the example:"
echo "1. Start the Node.js backend: cd node-backend && npm start"
echo "2. For development, start the React frontend: cd react-frontend && npm start"
echo "3. For production, the React frontend is served by the Node.js backend at: http://localhost:3000/react"
