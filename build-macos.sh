#!/bin/bash

# MedTrack macOS build script
# This script builds the MedTrack application for macOS

echo "===== MedTrack macOS Build Script ====="
echo "Building application for macOS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js which includes npm."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if electron-builder is installed
if ! npm list -g electron-builder &> /dev/null; then
    echo "Installing electron-builder globally..."
    npm install -g electron-builder
fi

# Build the application
echo "Building the application for macOS..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! The application package can be found in the 'dist' directory."
    echo "You can distribute the .dmg file to your users."
    
    # Open the dist directory
    open dist
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi

echo "===== Build process complete ====="
