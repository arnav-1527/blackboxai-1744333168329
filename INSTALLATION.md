# MedTrack - Installation Guide for macOS

This document provides instructions for installing and running the MedTrack 3D Medicine Inventory System on macOS.

## System Requirements

- macOS 10.13 (High Sierra) or later
- At least 4GB RAM
- 500MB of free disk space

## Installation Options

### Option 1: Download and Run the Pre-built Application

1. Download the latest version of MedTrack from the releases page:
   https://github.com/yourusername/medical-cabinet-app/releases

2. Open the downloaded `.dmg` file.

3. Drag the MedTrack application to your Applications folder.

4. Open the application from your Applications folder.

### Option 2: Build from Source

If you prefer to build the application from source, follow these steps:

1. Ensure you have Node.js (v14 or later) installed on your system.
   - You can download it from https://nodejs.org/

2. Clone the repository:
   ```
   git clone https://github.com/yourusername/medical-cabinet-app.git
   cd medical-cabinet-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the application in development mode:
   ```
   npm start
   ```

5. Package the application for macOS:
   ```
   npm run build
   ```
   This will create a distributable in the `dist` folder.

## First Run

1. When you first launch MedTrack, you'll be presented with a login screen.

2. Use the following demo credentials to log in:
   - Username: `admin`
   - Password: `admin123`
   
   or
   
   - Username: `user`
   - Password: `user123`

3. After logging in, you'll see the 3D Medicine Cabinet with sample inventory data.

## Troubleshooting

If you encounter any issues with the application, try the following:

1. Ensure your macOS is updated to the latest version.

2. Check that you have sufficient disk space and memory.

3. If the application won't start, try removing the application and reinstalling.

4. For more detailed troubleshooting, check the logs in:
   `~/Library/Logs/MedTrack/`

## Support

For additional help or to report issues, please visit:
https://github.com/yourusername/medical-cabinet-app/issues
