@echo off
REM Quick start script for PrepPilot on Windows
REM Run this after setup.bat has been executed

echo 🚀 Starting PrepPilot - Smart Exam Hub
echo ======================================

REM Check if virtual environment exists
if not exist ".venv" (
    echo ❌ Virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)

echo 🖥️ Starting Django backend server...
start "PrepPilot Backend" cmd /k "cd smart_exam_hub && ..\.venv\Scripts\python manage.py runserver"

echo 💻 Starting React frontend server...
timeout /t 3 /nobreak > nul
start "PrepPilot Frontend" cmd /k "cd smart-frontend && npm start"

echo.
echo 🎉 Both servers are starting up!
echo.
echo 📱 Access your application at:
echo    Frontend: http://localhost:3000
echo    Backend Admin: http://localhost:8000/admin
echo.
echo Press any key to exit...
pause > nul