@echo off
REM Build Windows Installer for Six Sigma Training Platform
REM This script creates a single-file executable installer

echo ========================================
echo Six Sigma Training Platform - Installer Build
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Step 1: Building web application...
echo ----------------------------------------
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed
    pause
    exit /b 1
)

echo.
echo Step 2: Building Windows installer...
echo ----------------------------------------
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Electron build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Installer location: release\SixSigma-Training-Setup-1.0.0.exe
echo Portable version:  release\SixSigma-Training-Portable-1.0.0.exe
echo.
pause
