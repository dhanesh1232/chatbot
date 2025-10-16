/**
 * ECODrIx Chatbot Widget Configuration
 *
 * A lightweight, embeddable chatbot widget for websites with extensive customization options.
 * Features include floating chat bubble, tooltip, iframe-based chat window, and smooth animations.
 *
 * @example
 * ```typescript
 * const widget = new ECODrIx({
 *   botUrl: "https://app.ecodrix.com/bot",
 *   bubbleIcon: "💬",
 *   bubbleColor: "#4f46e5",
 *   tooltipText: "Chat with us!",
 *   autoOpen: 5
 * });
 *
 * widget.init();
 * ```
 */
export interface ECODrIxWidgetConfig {
  // Required Properties
  /** The chatbot URL to load inside the iframe (required) */
  botUrl: string;

  // Bubble Appearance
  /** Emoji, SVG string, or image URL for the bubble icon */
  bubbleIcon?: string;
  /** Base color for the bubble gradient */
  bubbleColor?: string;
  /** Color of the icon inside the bubble */
  iconColor?: string;
  /** Diameter of the bubble in pixels */
  bubbleSize?: number;
  /** Box-shadow for the bubble element */
  bubbleShadow?: string;

  // Animation & Effects
  /** Color for the pulse animation around the bubble */
  pulseColor?: string;
  /** Enable ripple effect animation around the bubble */
  ripple?: boolean;
  /** Multiplier for ripple animation speed (higher = faster) */
  rippleSpeed?: number;

  // Positioning
  /** Position of the chat bubble on the screen */
  bubblePosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right";

  // Iframe Configuration
  /** Width of the iframe in pixels */
  iframeWidth?: number;
  /** Height of the iframe in pixels */
  iframeHeight?: number;
  /** Border radius of the iframe in pixels */
  iframeBorderRadius?: number;
  /** Box-shadow for the iframe element */
  shadow?: string;

  // Tooltip Configuration
  /** Text displayed in the tooltip on hover */
  tooltipText?: string;
  /** Text color of the tooltip */
  tooltipColor?: string;
  /** Background color of the tooltip */
  tooltipBgColor?: string;

  // Behavior Options
  /** Close iframe when clicking outside of it */
  closeClickOutside?: boolean;
  /** Auto-open iframe after specified seconds (0 = disabled) */
  autoOpen?: number;
}

/**
 * ECODrIx Chatbot Widget Class
 *
 * Lightweight, embeddable chatbot widget that renders a floating chat bubble
 * with tooltip and an iframe-based chat window.
 *
 * ✦ Key Features:
 * - Customizable chat bubble with emoji, SVG, or image icon
 * - Gradient bubble colors and pulse animations
 * - Tooltip with customizable text and colors
 * - Ripple effect with configurable speed
 * - Auto-open functionality with delay
 * - Responsive iframe with dynamic resizing
 * - Click-outside-to-close functionality
 * - Shadow and border-radius customization
 * - Smooth open/close animations
 *
 * ⚙️ Implementation Notes:
 * - Pure vanilla JS and CSS, no external dependencies
 * - Automatic iframe dimension updates on window resize/orientation change
 * - PostMessage communication with iframe for close events
 * - Programmatic initialization and control
 *
 * @class ECODrIx
 */
export declare class ECODrIx {
  /**
   * Creates a new ECODrIx chatbot widget instance
   * @param config - Configuration object for the widget
   */
  constructor(config: ECODrIxWidgetConfig);

  /**
   * Initialize the widget and render bubble + iframe
   * @throws {Error} If botUrl is not provided or invalid
   */
  init(): void;

  /** Show the iframe programmatically with animation */
  showIframe(): void;

  /** Hide the iframe programmatically with animation */
  hideIframe(): void;

  /** Toggle iframe open/close state */
  toggleIframe(): void;

  /**
   * Destroy the widget and clean up all DOM elements and event listeners
   * @returns {boolean} True if destruction was successful
   */
  destroy(): boolean;

  /**
   * Update iframe dimensions (called automatically on window resize)
   * @param width - Optional custom width, defaults to config value
   * @param height - Optional custom height, defaults to config value
   */
  updateDimensions(width?: number, height?: number): void;

  /**
   * Check if the iframe is currently visible
   * @returns {boolean} True if iframe is visible
   */
  isIframeVisible(): boolean;

  /**
   * Update widget configuration dynamically
   * @param newConfig - Partial configuration to update
   */
  updateConfig(newConfig: Partial<ECODrIxWidgetConfig>): void;
}
