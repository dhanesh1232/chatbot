let activeWidget = null;

class ECODrIxWidget {
  constructor(config) {
    if (activeWidget) return activeWidget;

    this.config = {
      bubbleIcon: "💬",
      bubbleColor: "#4f46e5",
      bubbleSize: 60,
      bubblePosition: "bottom-right",
      iframeWidth: 350,
      iframeHeight: 500,
      iframeBorderRadius: 10,
      ripple: true,
      rippleSpeed: 1.5,
      autoOpen: 0,
      ...config,
    };

    this.bubble = null;
    this.iframe = null;
    this.autoOpenTimeout = null;

    window.addEventListener("message", (event) => {
      if (
        event.origin !== "https://app.ecodrix.com" &&
        event.origin !== "http://localhost:3000"
      )
        return;
      if (event.data?.type === "CHAT_WIDGET_CLOSE") this.hideIframe();
    });
  }

  init() {
    this.createBubble();
    this.preloadIframe();
    if (this.config.autoOpen > 0) {
      this.autoOpenTimeout = setTimeout(
        () => this.showIframe(),
        this.config.autoOpen * 1000
      );
    }
    if (this.config.ripple) this.createRipple();
  }

  createBubble() {
    this.bubble = document.createElement("div");
    const icon = this.config.bubbleIcon;

    if (!icon) this.bubble.innerText = "💬";
    else if (icon.trim().startsWith("<svg")) this.bubble.innerHTML = icon;
    else if (/^(http|\/|\.\/)/.test(icon)) {
      const img = document.createElement("img");
      img.src = icon;
      img.style.maxWidth = "70%";
      img.style.maxHeight = "70%";
      img.style.objectFit = "contain";
      this.bubble.appendChild(img);
    } else this.bubble.innerText = icon;

    const pos = this.config.bubblePosition.split("-");
    this.bubble.style.cssText = `
      position: fixed;
      ${pos[0]}: 20px;
      ${pos[1]}: 20px;
      width: ${this.config.bubbleSize}px;
      height: ${this.config.bubbleSize}px;
      border-radius: 50%;
      background: ${this.config.bubbleColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99999;
      font-size: ${this.config.bubbleSize / 2}px;
      overflow: hidden;
      transition: transform 0.2s ease, opacity 0.3s ease;
    `;

    document.body.appendChild(this.bubble);
    this.bubble.addEventListener("click", () => this.showIframe());
  }

  createRipple() {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      top: 0;
      left: 0;
      pointer-events: none;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
      animation: ripple ${1.2 / this.config.rippleSpeed}s infinite;
    `;
    this.bubble.appendChild(ripple);

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes ripple {
        0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
        70% { transform: scale(1.2); box-shadow: 0 0 10px 10px rgba(255,255,255,0); }
        100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
      }
    `;
    document.head.appendChild(styleEl);
  }

  preloadIframe() {
    this.iframe = document.createElement("iframe");
    this.iframe.src = this.config.botUrl;
    this.iframe.style.cssText = `
      position: fixed;
      bottom: ${this.config.bubbleSize}px;
      right: 20px;
      width: ${this.config.iframeWidth}px;
      height: ${this.config.iframeHeight}px;
      border: none;
      border-radius: ${this.config.iframeBorderRadius}px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 99998;
      opacity: 0;
      transform: scale(0.5);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    document.body.appendChild(this.iframe);
  }

  showIframe() {
    if (!this.iframe || !this.bubble) return;
    this.bubble.style.transform = "scale(0.9)";
    setTimeout(() => (this.bubble.style.display = "none"), 150);

    this.iframe.style.opacity = "1";
    this.iframe.style.transform = "scale(1)";
    this.iframe.style.pointerEvents = "auto";
  }

  hideIframe() {
    if (!this.iframe || !this.bubble) return;
    this.iframe.style.opacity = "0";
    this.iframe.style.transform = "scale(0.5)";
    this.iframe.style.pointerEvents = "none";
    setTimeout(() => (this.bubble.style.display = "flex"), 200);
    this.bubble.style.transform = "scale(1)";
  }

  destroy() {
    if (this.iframe) this.iframe.remove();
    if (this.bubble) this.bubble.remove();
    if (this.autoOpenTimeout) clearTimeout(this.autoOpenTimeout);
    this.iframe = null;
    this.bubble = null;
    activeWidget = null;
  }
}

// UMD / CDN support
if (typeof window !== "undefined") {
  window.ECODrIx = {
    init: (opts) => {
      activeWidget = new ECODrIxWidget(opts);
      activeWidget.init();
    },
    destroy: () => activeWidget?.destroy(),
  };
}

export { ECODrIxWidget as ECODrIx };
