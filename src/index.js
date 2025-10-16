let activeWidget = null;

class ECODrIxWidget {
  constructor(config) {
    if (activeWidget) return activeWidget;

    this.config = {
      bubbleIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-icon"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>`,
      bubbleColor: "#4f46e5",
      iconColor: "#ffffff",
      pulseColor: "#34d399",
      tooltipText: "Chat with us!",
      tooltipColor: "#333333",
      tooltipBgColor: "#ffffff",
      closeClickOutside: true,
      bubbleSize: 56,
      bubblePosition: "bottom-right",
      iframeWidth: 340,
      iframeHeight: 500,
      iframeBorderRadius: 8,
      autoOpen: 0,
      shadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
      bubbleShadow: "0 10px 40px rgba(0,0,0,0.2)",
      ...config,
    };

    this.bubble = null;
    this.iframe = null;
    this.autoOpenTimeout = null;
    this.isOpen = false;

    window.addEventListener("message", (event) => {
      if (
        event.origin !== "https://app.ecodrix.com" &&
        event.origin !== "http://localhost:3000"
      )
        return;
      if (event.data?.type === "CHAT_WIDGET_CLOSE") this.hideIframe();
    });

    window.addEventListener("resize", () => this.updateDimensions());
    window.addEventListener("orientationchange", () => this.updateDimensions());
  }

  init() {
    this.updateDimensions();
    this.addStyles();
    this.createBubble();
    this.preloadIframe();

    if (this.config.autoOpen > 0) {
      this.autoOpenTimeout = setTimeout(
        () => this.showIframe(),
        this.config.autoOpen * 1000
      );
    }
  }

  updateDimensions() {
    if (!this.iframe) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let iframeWidth = this.config.iframeWidth;
    let iframeHeight = this.config.iframeHeight;

    if (vw <= 768) {
      iframeWidth = Math.min(360, iframeWidth * 0.9);
      iframeHeight = Math.min(540, iframeHeight * 1);
    }

    if (vw <= 480) {
      iframeWidth = vw - 80;
      iframeHeight = vh * 0.7;
    }

    this.iframe.style.width = `${iframeWidth}px`;
    this.iframe.style.height = `${iframeHeight}px`;
  }

  addStyles() {
    if (document.getElementById("ecodrix-widget-styles")) return;

    const styles = `
      @keyframes ecodrix-bubble-float {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-5px) scale(1.02); }
        100% { transform: translateY(0px) scale(1); }
      }
      @keyframes ecodrix-bubble-pulse {
        0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
        100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
      }

    `;

    const styleSheet = document.createElement("style");
    styleSheet.id = "ecodrix-widget-styles";
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  createBubble() {
    // Create container for bubble
    this.bubbleContainer = document.createElement("div");
    const pos = this.config.bubblePosition.split("-");
    this.bubbleContainer.style.cssText = `
    position: fixed;
    ${pos[0]}: 24px;
    ${pos[1]}: 16px;
    width: ${this.config.bubbleSize}px;
    height: ${this.config.bubbleSize}px;
    z-index: 100000;
    pointer-events: auto;
  `;

    // Create the bubble itself
    this.bubble = document.createElement("div");
    this.bubble.style.cssText = `
    width: ${this.config.bubbleSize}px;
    height: ${this.config.bubbleSize}px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${
      this.config.bubbleColor
    }, ${this.shadeColor(this.config.bubbleColor, -20)});
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    box-shadow: ${this.config.bubbleShadow};
  `;

    // Add icon
    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  `;
    iconContainer.innerHTML = this.config.bubbleIcon;
    this.bubble.appendChild(iconContainer);
    this.iconContainer = iconContainer;

    this.bubbleContainer.appendChild(this.bubble);
    document.body.appendChild(this.bubbleContainer);

    // Tooltip
    this.tooltip = document.createElement("div");
    this.tooltip.innerText = this.config.tooltipText;
    this.tooltip.style.cssText = `
      position: absolute;
      top: 50%;
      right: calc(100% + 8px);
      transform: translateY(-50%);
      background-color: ${this.config.tooltipBgColor};
      color: ${this.config.tooltipColor};
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 100001;
    `;
    // Create arrow
    const arrow = document.createElement("div");
    arrow.style.cssText = `
      position: absolute;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid ${this.config.tooltipBgColor};
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
    `;
    this.tooltip.appendChild(arrow);
    this.bubbleContainer.appendChild(this.tooltip);

    // Show tooltip only if iframe is closed
    this.bubble.addEventListener("mouseenter", () => {
      if (this.isOpen) return; // ❌ Prevent scale & tooltip when iframe open
      this.bubble.style.transform = "scale(1.1)";
      this.iconContainer.style.transform = "scale(1.1)";
      this.tooltip.style.opacity = "1";
      this.tooltip.style.transform = "translateY(-50%) translateX(-5px)";
    });
    this.bubble.addEventListener("mouseleave", () => {
      if (this.isOpen) return;
      this.bubble.style.transform = "scale(1)";
      this.iconContainer.style.transform = "scale(1)";
      this.tooltip.style.opacity = "0";
      this.tooltip.style.transform = "translateY(-50%) translateX(0)";
    });

    // Click to toggle iframe
    this.bubble.addEventListener("click", () => this.toggleIframe());
  }

  preloadIframe() {
    this.iframe = document.createElement("iframe");
    this.iframe.src = this.config.botUrl;
    this.iframe.allow = "microphone";
    this.iframe.style.cssText = `
      position: fixed;
      bottom: ${this.config.bubbleSize + 24}px;
      right: 16px;
      width: ${this.config.iframeWidth}px;
      height: ${this.config.iframeHeight}px;
      border: none;
      border-radius: ${this.config.iframeBorderRadius}px;
      box-shadow: ${this.config.shadow};
      z-index: 99999;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      transform-origin: bottom right;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
    `;
    document.body.appendChild(this.iframe);
  }

  toggleIframe() {
    this.isOpen ? this.hideIframe() : this.showIframe();
  }

  showIframe() {
    if (!this.iframe) return;
    this.isOpen = true;

    this.tooltip.style.opacity = "0"; // hide tooltip
    this.bubble.style.transform = "scale(1)";
    this.iframe.style.opacity = "1";
    this.iframe.style.transform = "scale(1) translateY(0)";
    this.iframe.style.pointerEvents = "auto";
  }

  hideIframe() {
    if (!this.iframe) return;
    this.isOpen = false;
    this.iframe.style.opacity = "0";
    this.iframe.style.transform = "scale(0.8) translateY(20px)";
    this.iframe.style.pointerEvents = "none";
  }

  shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16),
      G = parseInt(color.substring(3, 5), 16),
      B = parseInt(color.substring(5, 7), 16);
    R = Math.min(255, Math.round((R * (100 + percent)) / 100));
    G = Math.min(255, Math.round((G * (100 + percent)) / 100));
    B = Math.min(255, Math.round((B * (100 + percent)) / 100));
    const RR = R.toString(16).padStart(2, "0"),
      GG = G.toString(16).padStart(2, "0"),
      BB = B.toString(16).padStart(2, "0");
    return `#${RR}${GG}${BB}`;
  }

  destroy() {
    if (this.iframe) this.iframe.remove();
    if (this.bubble) this.bubble.remove();
    if (this.autoOpenTimeout) clearTimeout(this.autoOpenTimeout);
    const styles = document.getElementById("ecodrix-widget-styles");
    if (styles) styles.remove();
    activeWidget = null;
  }
}

// UMD / CDN ready
if (typeof window !== "undefined") {
  window.ECODrIx = {
    init: (opts) => {
      activeWidget = new ECODrIxWidget(opts);
      activeWidget.init();
      return activeWidget;
    },
    destroy: () => activeWidget?.destroy(),
    show: () => activeWidget?.showIframe(),
    hide: () => activeWidget?.hideIframe(),
  };
}

export { ECODrIxWidget as ECODrIx };
