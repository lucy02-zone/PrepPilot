@echo off
REM PrepPilot Setup Script for Windows
REM This script will install all dependencies and set up the project

echo 🚀 Setting up PrepPilot - Smart Exam Hub
echo ========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create virtual environment for Python backend
echo 📦 Setting up Python virtual environment...
python -m venv .venv

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Create requirements.txt
echo 📦 Creating requirements.txt...
(
echo Django==5.2.7
echo djangorestframework==3.15.2
echo django-cors-headers==4.6.0
echo djangorestframework-simplejwt==5.3.0
echo Pillow==10.4.0
echo python-decouple==3.8
echo whitenoise==6.8.2
) > requirements.txt

REM Install Python dependencies
echo 📦 Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Set up Django backend
echo 🗄️ Setting up Django backend...
cd smart_exam_hub

REM Run migrations
python manage.py makemigrations
python manage.py migrate

echo 👤 Creating superuser (you can skip this step)...
python manage.py createsuperuser --noinput --username admin --email admin@example.com || echo Superuser creation skipped

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd smart-frontend
npm install
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 🚀 To start the application:
echo 1. Start the backend:
echo    cd smart_exam_hub ^&^& ..\.venv\Scripts\python manage.py runserver
echo.
echo 2. In a new terminal, start the frontend:
echo    cd smart-frontend ^&^& npm start
echo.
echo 3. Open your browser and go to:
echo    Frontend: http://localhost:3000
echo    Backend Admin: http://localhost:8000/admin
echo.
echo 📝 Note: Make sure both servers are running for the app to work properly

pause