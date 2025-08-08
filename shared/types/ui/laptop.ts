export interface LaptopApp {
    id: string;
    name: string;
    icon: string;
    isOpen: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    minimized: boolean;
    maximized: boolean;
    desktopPosition?: { x: number; y: number };
    originalPosition?: { x: number; y: number };
    originalSize?: { width: number; height: number };
    preMinimizePosition?: { x: number; y: number };
    preMinimizeSize?: { width: number; height: number };
    preMinimizeMaximized?: boolean;
}

export interface LaptopState {
    apps: LaptopApp[];
    highestZIndex: number;
    wallpaper: string;
    currentDocument: string | null;
}