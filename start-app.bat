@echo off
title TODO Application Startup

echo.
echo ========================================
echo 🚀 Starting TODO Application...
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed  
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

echo 📦 Installing dependencies...
echo.

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

:: Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo 🔄 Starting services...
echo.

:: Start backend server in a new command window
echo Starting backend server...
start "TODO Backend Server" cmd /k "cd /d "%CD%\backend" && echo Backend Server Starting... && npm run dev"

:: Wait for backend to start
timeout /t 5 /nobreak >nul

:: Start frontend server in a new command window
echo Starting frontend server...
start "TODO Frontend Server" cmd /k "cd /d "%CD%\frontend" && echo Frontend Server Starting... && npm run dev"

:: Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo 🎉 TODO Application Started Successfully!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 📋 Instructions:
echo • Two new command windows should have opened
echo • Wait for both servers to fully start
echo • Open your browser and navigate to http://localhost:3000
echo • To stop the servers, close the command windows or press Ctrl+C
echo.
echo 💡 Tips:
echo • Backend API is available at http://localhost:5000/tasks
echo • Check the command windows for any error messages
echo • If ports are busy, close other applications using ports 3000 and 5000
echo.
echo Press any key to exit this script...
pause >nul
