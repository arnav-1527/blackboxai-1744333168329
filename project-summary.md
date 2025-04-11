# MedTrack - 3D Medicine Cabinet for macOS

## Project Overview

MedTrack is a native macOS application that helps users keep track of their medicine inventory through an interactive 3D visualization. The application converts a web interface into a native macOS app with system integration features.

## Key Features

- **3D Interactive Cabinet**: Visualize medicines in a virtual 3D cabinet
- **Inventory Management**: Add, update, and track medicine information
- **Expiry Alerts**: Get notified when medicines are expiring soon
- **Low Stock Warnings**: Alerts when medicines need to be restocked
- **Native macOS Experience**: Feels like a real Mac app, not a website

## Technologies Used

- **Electron**: Framework for creating native applications with web technologies
- **Three.js**: 3D visualization library for the interactive cabinet
- **TailwindCSS**: Utility-first CSS framework for styling
- **Modern JavaScript**: ES6+ features for clean, maintainable code
- **macOS Integration**: Native menu bar, keyboard shortcuts, notifications

## Project Structure

```
medical-cabinet-app/
├── assets/               # Application assets and icons
├── scripts/              
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Main dashboard and 3D visualization
│   ├── login.js          # Login screen logic
│   └── macos-integration.js # macOS native features
├── index.html            # Login page
├── dashboard.html        # Main dashboard page
├── main.js               # Electron main process
├── preload.js            # Secure bridge between Electron and web content
├── package.json          # App configuration and dependencies
└── build-macos.sh        # Build script for macOS
```

## How It Was Made

1. **Web Application Base**: Built a web interface for medicine tracking using HTML, CSS (Tailwind) and JavaScript
2. **3D Visualization**: Added an interactive 3D cabinet using Three.js where medicines are shown visually
3. **Electron Wrapper**: Wrapped the web app in Electron to make it a native desktop application
4. **macOS Integration**: Added macOS-specific features:
   - Native window controls and menus
   - System notifications for medicine alerts
   - Keyboard shortcuts (Command+F for search, etc.)
   - macOS styling and UI enhancements

## How to Build and Run

1. **Prerequisites**: Node.js and npm installed
2. **Setup**: Clone the repository and run `npm install`
3. **Development**: Run `npm start` to launch in development mode
4. **Production Build**: Run `./build-macos.sh` or `npm run build` to create the distributable app
5. **Installation**: Drag the built app to your Applications folder

## Usage

1. Launch the application
2. Log in with the demo credentials (admin/admin123)
3. View the 3D medicine cabinet and inventory
4. Add, update, or remove medicines as needed
5. Receive alerts for expiring or low-stock medicines
