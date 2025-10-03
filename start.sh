#!/bin/bash

# Quick start script for PrepPilot
# Run this after setup.sh has been executed

echo "🚀 Starting PrepPilot - Smart Exam Hub"
echo "======================================"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🖥️  Starting Django backend server..."
    cd smart_exam_hub
    ../.venv/bin/python manage.py runserver &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "💻 Starting React frontend server..."
    cd smart-frontend
    npm start &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
    cd ..
}

# Start both servers
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "🎉 Both servers are starting up!"
echo ""
echo "📱 Access your application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend Admin: http://localhost:8000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait