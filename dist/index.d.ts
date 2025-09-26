export interface ECODrIxWidgetConfig {
  bubbleIcon?: string; // emoji, svg, or image URL
  bubbleColor?: string;
  bubbleSize?: number;
  bubblePosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  iframeWidth?: number;
  iframeHeight?: number;
  iframeBorderRadius?: number;
  ripple?: boolean;
  rippleSpeed?: number; // multiplier for ripple animation speed
  autoOpen?: number; // seconds before auto-open iframe (0 = disabled)
  botUrl: string;
}

export declare class ECODrIxWidget {
  constructor(config: ECODrIxWidgetConfig);
  init(): void;
  destroy(): void;
}

export declare class ECODrIx {
  constructor(config: ECODrIxWidgetConfig);
  init(): void;
  destroy(): void;
}
