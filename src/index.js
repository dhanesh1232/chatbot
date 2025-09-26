let activeWidget = null;

class ECODrIxWidget {
  constructor(config) {
    if (activeWidget) return activeWidget;

    this.config = {
      bubbleIcon: "💬",
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
      ripple: true,
      rippleSpeed: 1.5,
      autoOpen: 0,
      shadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
      bubbleShadow: "0 10px 40px rgba(0,0,0,0.2)",
      ...config,
    };

    this.bubble = null;
    this.iframe = null;
    this.rippleElements = [];
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

    if (this.config.ripple) this.createRippleEffect();
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
      @keyframes ecodrix-ripple {
        0% { transform: scale(0.8); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.3; }
        100% { transform: scale(1.4); opacity: 0; }
      }
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
    this.bubble = document.createElement("div");
    this.bubble.className = "ecodrix-bubble-enter";
    const icon = this.config.bubbleIcon;

    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    `;

    if (!icon) {
      iconContainer.innerText = "💬";
    } else if (icon.trim().startsWith("<svg")) {
      iconContainer.innerHTML = icon;
    } else if (/^(http|\/|\.\/)/.test(icon)) {
      const img = document.createElement("img");
      img.src = icon;
      img.style.cssText = `
        width: 60%;
        height: 60%;
        object-fit: contain;
        filter: brightness(0) invert(1);
      `;
      iconContainer.appendChild(img);
    } else {
      iconContainer.innerText = icon;
      iconContainer.style.fontSize = `${this.config.bubbleSize / 2.5}px`;
    }

    const pos = this.config.bubblePosition.split("-");
    this.bubble.style.cssText = `
      position: fixed;
      ${pos[0]}: 24px;
      ${pos[1]}: 16px;
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
      z-index: 100000;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: ${this.config.bubbleShadow};
      border: 2px solid rgba(255, 255, 255, 0.1);
    `;
    this.bubble.appendChild(iconContainer);
    document.body.appendChild(this.bubble);

    this.bubble.addEventListener("mouseenter", () => {
      this.bubble.style.transform = "scale(1.1)";
      iconContainer.style.transform = "scale(1.1)";
    });
    this.bubble.addEventListener("mouseleave", () => {
      if (!this.isOpen) {
        this.bubble.style.transform = "scale(1)";
        iconContainer.style.transform = "scale(1)";
      }
    });
    this.bubble.addEventListener("click", () => this.toggleIframe());
  }

  createRippleEffect() {
    for (let i = 0; i < 3; i++) {
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        top: 0;
        left: 0;
        pointer-events: none;
        border: 2px solid rgba(255, 255, 255, 0.3);
        animation: ecodrix-ripple ${
          (3 - i) / this.config.rippleSpeed
        }s ease-in-out infinite;
        animation-delay: ${i * 0.5}s;
      `;
      this.bubble.appendChild(ripple);
      this.rippleElements.push(ripple);
    }

    setInterval(() => {
      this.bubble.classList.add("ecodrix-bubble-pulse");
      setTimeout(() => {
        this.bubble.classList.remove("ecodrix-bubble-pulse");
      }, 2000);
    }, 10000);
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
    if (!this.iframe || !this.bubble) return;
    this.isOpen = true;
    this.rippleElements.forEach((r) => (r.style.display = "none"));
    this.bubble.style.transform = "scale(0.8)";
    this.bubble.style.opacity = "0.7";
    this.bubble.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
    this.iframe.style.opacity = "1";
    this.iframe.style.transform = "scale(1) translateY(0)";
    this.iframe.style.pointerEvents = "auto";
  }

  hideIframe() {
    if (!this.iframe || !this.bubble) return;
    this.isOpen = false;
    this.iframe.style.opacity = "0";
    this.iframe.style.transform = "scale(0.8) translateY(20px)";
    this.iframe.style.pointerEvents = "none";
    setTimeout(() => {
      this.bubble.style.transform = "scale(1)";
      this.bubble.style.opacity = "1";
      this.bubble.style.boxShadow = this.config.bubbleShadow;
      this.rippleElements.forEach((r) => (r.style.display = "block"));
    }, 200);
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
    this.rippleElements = [];
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
