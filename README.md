````markdown
# ecodrix-sdk

A lightweight SDK to embed **ECODrIx chatbot widgets** into any website or framework with minimal setup.

---

## Features

- Fully customizable chat bubble (icon, color, size, position)
- Ripple animation for the bubble
- Auto-open option after a configurable delay
- Preloaded iframe for faster display
- Supports emoji, SVG, or image icons
- Easy `init` and `destroy` methods
- Works in any web environment

---

## Installation

You can include the SDK via **npm** or **direct script**:

### Using npm

```bash
npm install ecodrix-sdk
```
````

### Using CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ecodrix-sdk/dist/index.umd.js"></script>
```

---

## Usage

### Initialize the widget

```javascript
import { ECODrIx } from "ecodrix-sdk";

ECODrIx.init({
  botUrl: "https://app.ecodrix.com/widget-frame",
  bubbleIcon: "<svg>...</svg>", // or emoji "💬" or image URL
  bubbleColor: "#4f46e5",
  bubbleSize: 60,
  bubblePosition: "bottom-right",
  iframeWidth: 350,
  iframeHeight: 500,
  iframeBorderRadius: 10,
  ripple: true, // enable bubble ripple
  rippleSpeed: 1.5, // speed multiplier
  autoOpen: 15, // seconds after which iframe auto-opens (0 = disabled)
});
```

### Destroy the widget

```javascript
ECODrIx.destroy();
```

---

## Customization Options

| Option               | Type          | Default        | Description                                        |
| -------------------- | ------------- | -------------- | -------------------------------------------------- | ----------- | -------------- | -------------------------------- |
| `botUrl`             | string        | —              | URL of the chatbot iframe                          |
| `bubbleIcon`         | string        | "💬"           | Emoji, SVG, or image URL for bubble                |
| `bubbleColor`        | string        | "#4f46e5"      | Bubble background color                            |
| `bubbleSize`         | number        | 60             | Diameter of the bubble in px                       |
| `bubblePosition`     | "bottom-left" | "bottom-right" | "top-left"                                         | "top-right" | "bottom-right" | Position of the bubble on screen |
| `iframeWidth`        | number        | 350            | Width of the iframe                                |
| `iframeHeight`       | number        | 500            | Height of the iframe                               |
| `iframeBorderRadius` | number        | 10             | Border radius of the iframe                        |
| `ripple`             | boolean       | true           | Enable ripple animation on bubble                  |
| `rippleSpeed`        | number        | 1.5            | Speed of ripple animation                          |
| `autoOpen`           | number        | 0              | Time in seconds to auto-open iframe (0 = disabled) |

---

## License

MIT License. See [LICENSE](LICENSE) for details.

```

---

If you want, I can also make a **version with GIF animations** showing the bubble ripple and iframe auto-open for your GitHub README—it’ll make your repo **much more attractive** to users.

Do you want me to do that?
```
