# Six Sigma Training Platform - Installer Guide

This guide explains how to build and distribute the Six Sigma Training Platform as a Windows installer (single-file executable).

## Quick Start

### Option 1: Run the Build Script (Recommended)

Simply double-click `build-installer.bat` or run it from Command Prompt:

```batch
build-installer.bat
```

This will:
1. Install dependencies (if needed)
2. Build the web application
3. Package it into a Windows installer
4. Output to the `release/` folder

### Option 2: Manual Build Steps

```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Build the Windows installer
npm run electron:build:win
```

## Output Files

After building, you'll find these files in the `release/` folder:

| File | Description | Size |
|------|-------------|------|
| `SixSigma-Training-Setup-1.0.0.exe` | Windows installer (setup wizard) | ~80-100 MB |
| `SixSigma-Training-Portable-1.0.0.exe` | Portable single-file executable | ~80-100 MB |
| `SixSigma-Training-Setup-1.0.0.exe.blockmap` | Update differential file | Small |
| `latest.yml` | Auto-update manifest | Small |

### Installer vs Portable

- **Setup Installer** (`SixSigma-Training-Setup-1.0.0.exe`):
  - Shows installation wizard
  - Allows choosing install location
  - Creates Start Menu and Desktop shortcuts
  - Can be uninstalled via Control Panel
  - Recommended for most users

- **Portable** (`SixSigma-Training-Portable-1.0.0.exe`):
  - Single-file executable
  - No installation required
  - Run from USB drive
  - No registry entries
  - Data stored in same folder

## System Requirements

- **OS**: Windows 10 (64-bit) or later
- **RAM**: 4 GB minimum, 8 GB recommended
- **Storage**: 500 MB free space
- **Display**: 1280x720 resolution or higher
- **Internet**: Optional (for updates only)

## Distribution

### For End Users

1. Share the `SixSigma-Training-Setup-1.0.0.exe` file
2. Users double-click to install
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

### Silent Installation (Enterprise)

For silent/unattended installation:

```batch
SixSigma-Training-Setup-1.0.0.exe /S /D=C:\SixSigmaTraining
```

Options:
- `/S` - Silent mode (no dialogs)
- `/D=path` - Set installation directory

## Building for Other Platforms

### macOS (.dmg)

```bash
npm run electron:build:mac
```

Output: `release/Six Sigma Training Platform-1.0.0.dmg`

### Linux (.AppImage and .deb)

```bash
npm run electron:build:linux
```

Output:
- `release/Six Sigma Training Platform-1.0.0.AppImage`
- `release/six-sigma-training_1.0.0_amd64.deb`

## Customization

### Change App Icon

1. Replace `public/favicon.ico` with your icon
2. Ensure it's a valid .ico file (256x256 recommended)
3. Rebuild the installer

### Change Product Name

Edit in `package.json`:

```json
{
  "build": {
    "productName": "Your Custom Name"
  }
}
```

### Code Signing (Windows)

For a trusted installer (no "Unknown Publisher" warning), you need a code signing certificate:

```json
{
  "build": {
    "win": {
      "certificateFile": "certificate.p12",
      "certificatePassword": "password"
    }
  }
}
```

## Troubleshooting

### Build Fails with "Node modules not found"

```bash
npm install
npm run electron:build:win
```

### Build Fails with "Out of memory"

Close other applications or increase Node memory:

```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm run electron:build:win
```

### Application Shows Blank Screen

Check that `base: './'` is set in `vite.config.ts` and the build completed successfully.

### Antivirus Flags the Installer

This can happen with unsigned executables. Options:
1. Sign the executable with a code signing certificate
2. Submit to antivirus vendors for whitelisting
3. Users can add an exception

## Advanced Configuration

### Auto-Updates

To enable auto-updates, configure a publishing provider in `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "six-sigma-training"
    }
  }
}
```

### One-Click Installer

Change in `package.json`:

```json
{
  "build": {
    "nsis": {
      "oneClick": true,
      "allowToChangeInstallationDirectory": false
    }
  }
}
```

## File Structure

```
six-sigma-training/
├── electron/              # Electron main process
│   ├── main.cjs          # Main entry point
│   └── preload.cjs       # Secure preload script
├── dist/                 # Web build output
├── release/              # Installer output (created after build)
├── build-installer.bat   # Windows build script
├── package.json          # App configuration
└── vite.config.ts        # Vite build config
```

## Support

For build issues:
1. Check the [Electron Builder documentation](https://www.electron.build/)
2. Review the [Electron documentation](https://www.electronjs.org/docs)
3. Check build logs in terminal/output

## License

The installer packages the Six Sigma Training Platform for distribution.
