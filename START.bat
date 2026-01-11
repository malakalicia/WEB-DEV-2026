@echo off
echo ================================================
echo   SII Skills Connect - Demarrage
echo ================================================
echo.
echo Installation des dependances...
cd backend
call npm install
echo.
echo Demarrage du serveur...
call npm start
pause
