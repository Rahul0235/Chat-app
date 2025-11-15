@echo off
echo Starting Chat App...
echo.

echo Starting Server...
start "Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting Client...
start "Client" cmd /k "cd client && npm run dev"

echo.
echo Both server and client are starting...
echo Server will run on http://localhost:5000
echo Client will run on http://localhost:5173
pause