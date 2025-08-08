export interface WindowApp {
    id: string;
    name: string;
    icon: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    maximized?: boolean;
    minimized?: boolean;
}

export interface WindowProps {
    app: WindowApp;
}