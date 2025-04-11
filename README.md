# MedTrack - 3D Medicine Inventory System for macOS

A native macOS application for managing medicine inventory with an interactive 3D cabinet view.

![MedTrack Screenshot](https://via.placeholder.com/800x450.png?text=MedTrack+3D+Medicine+Inventory)

## Features

- **3D Medicine Cabinet**: Interactive visualization of medicine inventory
- **Medicine Management**: Add, update, and delete medicine entries
- **Inventory Alerts**: Get notified when medicines are running low or expiring soon
- **Category Organization**: Automatically organizes medicines by category
- **Search Functionality**: Quickly find medicines in your inventory
- **Built for macOS**: Native application experience

## Quick Start

### Installation

See [INSTALLATION.md](./INSTALLATION.md) for detailed installation instructions.

To build the application:

```bash
# Make the build script executable (if not already)
chmod +x build-macos.sh

# Run the build script
./build-macos.sh
```

### Login

Use the following demo credentials:
- Username: `admin`
- Password: `admin123`

## Development

This application is built using:
- Electron for the native macOS wrapper
- Three.js for 3D visualization
- TailwindCSS for styling

### Project Structure

```
medical-cabinet-app/
├── assets/               # Application assets
│   └── icon.svg          # Application icon
├── scripts/              # Application scripts
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Main dashboard and 3D visualization
│   └── login.js          # Login screen logic
├── index.html            # Login page
├── dashboard.html        # Main dashboard page
├── main.js               # Electron main process
├── preload.js            # Electron preload script
├── package.json          # Application metadata and dependencies
├── build-macos.sh        # macOS build script
└── INSTALLATION.md       # Detailed installation guide
```

### Building from Source

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm start`
4. Build for production: `npm run build`

## License

MIT
