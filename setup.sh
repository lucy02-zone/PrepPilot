#!/bin/bash

# PrepPilot Setup Script for Unix/Linux/macOS
# This script will install all dependencies and set up the project

set -e  # Exit on any error

echo "🚀 Setting up PrepPilot - Smart Exam Hub"
echo "========================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create virtual environment for Python backend
echo "📦 Setting up Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source .venv/Scripts/activate
else
    source .venv/bin/activate
fi

# Install Python dependencies (create requirements.txt first)
echo "📦 Installing Python dependencies..."
cat > requirements.txt << EOF
Django==5.2.7
djangorestframework==3.15.2
django-cors-headers==4.6.0
djangorestframework-simplejwt==5.3.0
Pillow==10.4.0
python-decouple==3.8
whitenoise==6.8.2
EOF

pip install --upgrade pip
pip install -r requirements.txt

# Set up Django backend
echo "🗄️  Setting up Django backend..."
cd smart_exam_hub

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser (optional - you can skip this)..."
echo "Press Ctrl+C to skip superuser creation"
python manage.py createsuperuser --noinput --username admin --email admin@example.com || echo "Superuser creation skipped"

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd smart-frontend
npm install
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "1. Start the backend:"
echo "   cd smart_exam_hub && ../.venv/bin/python manage.py runserver"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd smart-frontend && npm start"
echo ""
echo "3. Open your browser and go to:"
echo "   Frontend: http://localhost:3000"
echo "   Backend Admin: http://localhost:8000/admin"
echo ""
echo "📝 Note: Make sure both servers are running for the app to work properly"