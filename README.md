# Auto Scroll

A lightweight Chrome extension that automatically scrolls web pages at a customizable speed. Perfect for hands-free reading, watching long content, or browsing while multitasking.

## Features

- **Customizable Scroll Speed** - Set the delay between scrolls (0-2000ms)
- **Adjustable Scroll Distance** - Configure pixels per scroll (-1000 to 1000px)
- **Pause/Resume** - Instantly pause and resume scrolling without losing your settings
- **Per-Site Settings** - Different scroll configurations saved automatically for each website
- **Sync Mode** - Enable auto-scroll on page load with your saved settings
- **Keyboard Shortcuts** - Quick controls for power users
- **Multi-language Support** - Available in English and Arabic

## Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation (Developer Mode)

1. Download or clone this repository
   ```bash
   git clone https://github.com/yourusername/scroller.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked** and select the `scroller` folder

5. The Auto Scroll icon will appear in your browser toolbar

## Usage

### Basic Controls

1. Click the Auto Scroll icon in your toolbar to open the popup
2. Set your preferences:
   - **Speed (ms)**: Time between each scroll action (lower = faster)
   - **Distance (px)**: Pixels to scroll each time (negative values scroll up)
3. Click **Start** to begin auto-scrolling
4. Click **Pause** to temporarily stop (your settings are preserved)
5. Click **Resume** to continue from where you paused
6. Click **Reset** to stop scrolling and clear values

### Sync Mode

Enable the **Sync** toggle to:
- Automatically start scrolling when you visit the page
- Save your settings per website
- Changes apply instantly without clicking Start

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Pause/Resume scrolling |
| `Esc` | Stop scrolling |

## Configuration Options

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Speed | 0-2000ms | 300ms | Delay between scroll actions |
| Distance | -1000 to 1000px | 30px | Pixels per scroll (negative = scroll up) |
| Sync | On/Off | Off | Auto-start on page load |

## Use Cases

- **Reading Articles** - Hands-free reading at your preferred pace
- **Social Media Feeds** - Continuous scrolling through feeds
- **Documentation** - Review long documents without manual scrolling
- **Video Backgrounds** - Create smooth scrolling effects for recordings
- **Accessibility** - Assist users who have difficulty with manual scrolling

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab`, `storage`
- **Storage**: Chrome Sync Storage (settings sync across devices)
- **Compatibility**: Chrome, Chromium-based browsers (Edge, Brave, etc.)

## Project Structure

```
scroller/
├── manifest.json          # Extension configuration
├── popup/
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Popup logic and event handling
│   └── popup.css         # Styling
├── scripts/
│   ├── content-script.js # Injected scroll functionality
│   └── Helper.js         # Utility modules
├── icons/                # Extension icons (16, 32, 48, 128px)
└── _locales/
    ├── en/messages.json  # English translations
    └── ar/messages.json  # Arabic translations
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Abdulrahman Huwais**

---

If you find this extension useful, please consider giving it a star on GitHub!
