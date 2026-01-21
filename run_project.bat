@echo off
echo Starting Diabetic Retinopathy Dashboard...

:: Start Backend
start "DR Backend" cmd /k "cd backend && python app.py"

:: Start Frontend
start "DR Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://127.0.0.1:5000
pause
