import { defineStore } from 'pinia';

const generateAppConfig = (appId: string, missionApp?: MissionApp) => {
    if (missionApp) {
        return {
            name: missionApp.name,
            icon: missionApp.icon,
            component: getComponentForApp(appId, missionApp),
            position: { x: 100, y: 100 },
            size: { width: 800, height: 600 }
        };
    }

    const builtInApp = getAppById(appId);
    if (builtInApp) {
        return {
            name: builtInApp.name,
            icon: builtInApp.icon,
            component: getComponentForApp(appId, builtInApp),
            position: { x: 100, y: 100 },
            size: { width: 800, height: 600 }
        };
    }

    return {
        name: appId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        icon: '📋',
        component: 'Default',
        position: { x: 100, y: 100 },
        size: { width: 800, height: 600 }
    };
};

export const useLaptopStore = defineStore('laptop', {
    state: (): LaptopState => ({
        highestZIndex: 100,
        wallpaper: '',
        currentDocument: null,
        apps: []
    }),

    actions: {
        initialize() {
            this.initializeAppsForMission();
        },

        initializeAppsForMission() {
            const gameStore = useGameStore();
            const missionContent = gameStore.currentMissionContent;

            const defaultApps = getDefaultApps();
            const missionApps = missionContent?.availableApps || [];
            const customApps = missionContent?.customApps || [];

            const allAppIds = [...new Set([...defaultApps, ...missionApps])];

            const desktopAppIds = allAppIds.filter(appId => {
                const missionApp = customApps.find((app: MissionApp) => app.id === appId);
                const builtInApp = getAppById(appId);
                const app = missionApp || builtInApp;

                return app?.showOnDesktop !== false;
            });

            const iconSize = 105;
            const startX = 0;
            const startY = 0;
            const screenHeight = 900;
            const iconsPerColumn = Math.floor(screenHeight / iconSize);
            
            this.apps = allAppIds.map((appId) => {
                const missionApp = customApps.find((app: MissionApp) => app.id === appId);
                const appConfig = generateAppConfig(appId, missionApp);

                const desktopIndex = desktopAppIds.indexOf(appId);
                const appObj: LaptopApp = {
                    id: appId,
                    ...appConfig,
                    isOpen: false,
                    zIndex: 100,
                    minimized: false,
                    maximized: false
                };

                if (desktopIndex !== -1) {
                    const column = Math.floor(desktopIndex / iconsPerColumn);
                    const row = desktopIndex % iconsPerColumn;
                    appObj.desktopPosition = {
                        x: startX + (column * iconSize),
                        y: startY + (row * iconSize)
                    };
                }

                return appObj;
            });

            customApps.forEach((missionApp: MissionApp, index: number) => {
                if (!allAppIds.includes(missionApp.id)) {
                    const totalIndex = allAppIds.length + index;
                    const column = Math.floor(totalIndex / iconsPerColumn);
                    const row = totalIndex % iconsPerColumn;

                    const x = startX + (column * iconSize);
                    const y = startY + (row * iconSize);

                    const appConfig = generateAppConfig(missionApp.id, missionApp);

                    this.apps.push({
                        id: missionApp.id,
                        ...appConfig,
                        isOpen: false,
                        zIndex: 100,
                        desktopPosition: { x, y },
                        minimized: false,
                        maximized: false
                    });
                }
            });
        },

        openApp(appId: string) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);

            if (app) {
                app.isOpen = true;

                if (app.minimized) {
                    app.minimized = false;

                    if (app.preMinimizePosition) {
                        app.position = { ...app.preMinimizePosition };
                    }
                    if (app.preMinimizeSize) {
                        app.size = { ...app.preMinimizeSize };
                    }
                    if (app.preMinimizeMaximized) {
                        app.maximized = true;
                    }

                    delete app.preMinimizePosition;
                    delete app.preMinimizeSize;
                    delete app.preMinimizeMaximized;
                }

                this.bringToFront(appId);
            }
        },

        closeApp(appId: string) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                app.isOpen = false;
                app.minimized = false;
                app.maximized = false;
                delete app.originalPosition;
                delete app.originalSize;
                delete app.preMinimizePosition;
                delete app.preMinimizeSize;
                delete app.preMinimizeMaximized;
            }
        },

        minimizeApp(appId: string) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                app.preMinimizePosition = { ...app.position };
                app.preMinimizeSize = { ...app.size };
                app.preMinimizeMaximized = app.maximized;

                app.minimized = true;
                app.maximized = false;
            }
        },

        maximizeApp(appId: string) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                if (app.maximized) {
                    if (app.originalPosition && app.originalSize) {
                        app.position = { ...app.originalPosition };
                        app.size = { ...app.originalSize };
                    }
                    app.maximized = false;
                } else {
                    app.originalPosition = { ...app.position };
                    app.originalSize = { ...app.size };

                    const windowsContainer = document.querySelector('.windows-container') as HTMLElement;
                    if (windowsContainer) {
                        const containerRect = windowsContainer.getBoundingClientRect();
                        app.position = { x: 0, y: 0 };
                        app.size = {
                            width: containerRect.width,
                            height: containerRect.height
                        };
                    } else {
                        app.position = { x: 0, y: 0 };
                        app.size = {
                            width: window.innerWidth,
                            height: window.innerHeight - 50
                        };
                    }
                    app.maximized = true;
                }

                app.minimized = false;
                this.bringToFront(appId);
            }
        },

        bringToFront(appId: string) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                this.highestZIndex++;
                app.zIndex = this.highestZIndex;
            }
        },

        moveApp(appId: string, position: { x: number; y: number }) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                app.position = position;
            }
        },

        resizeApp(appId: string, size: { width: number; height: number }) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                app.size = size;
            }
        },

        handleWindowResize() {
            this.apps.forEach((app: LaptopApp) => {
                if (app.maximized) {
                    const container = document.querySelector('.windows-container');
                    const containerRect = container?.getBoundingClientRect();

                    app.size = {
                        width: containerRect?.width || window.innerWidth,
                        height: containerRect?.height || (window.innerHeight - 50)
                    };
                }
            });

            this.refreshGridPositions();
        },

        refreshGridPositions() {
            const newGridPositions = this.getGridPositions();
            const maxX = Math.max(...newGridPositions.map((pos: { x: number; y: number }) => pos.x));
            const maxY = Math.max(...newGridPositions.map((pos: { x: number; y: number }) => pos.y));

            this.apps.forEach((app: LaptopApp) => {
                if (app.desktopPosition && (app.desktopPosition.x > maxX || app.desktopPosition.y > maxY)) {
                    const availablePositions = this.getAvailableGridPositions();
                    if (availablePositions.length > 0) {
                        let closestPosition = availablePositions[0];
                        let minDistance = Number.MAX_VALUE;

                        for (const pos of availablePositions) {
                            if (!app.desktopPosition) continue;

                            const distance = Math.sqrt(
                                Math.pow(app.desktopPosition.x - pos.x, 2) +
                                Math.pow(app.desktopPosition.y - pos.y, 2)
                            );

                            if (distance < minDistance) {
                                minDistance = distance;
                                closestPosition = pos;
                            }
                        }

                        if (closestPosition) {
                            app.desktopPosition = { x: closestPosition.x, y: closestPosition.y };
                        }
                    }
                }
            });
        },

        updateDesktopIconPosition(appId: string, x: number, y: number) {
            const app = this.apps.find((a: LaptopApp) => a.id === appId);
            if (app) {
                app.desktopPosition = { x, y };
            }
        },

        getGridPositions() {
            const gridSizeX = 105;
            const gridSizeY = 105;
            const startX = 0;
            const startY = 0;
            const positions = [];

            const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
            const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

            const cols = Math.floor(screenWidth / gridSizeX);
            const rows = Math.floor((screenHeight - 100) / gridSizeY);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    positions.push({
                        x: startX + (col * gridSizeX),
                        y: startY + (row * gridSizeY)
                    });
                }
            }

            return positions;
        },

        getAvailableGridPositions() {
            const allPositions = this.getGridPositions();
            const usedPositions = this.apps
                .map((app: LaptopApp) => app.desktopPosition)
                .filter((pos): pos is { x: number; y: number } => !!pos);

            return allPositions.filter((pos: { x: number; y: number }) =>
                !usedPositions.some((used: { x: number; y: number }) =>
                    Math.abs(used.x - pos.x) < 5 && Math.abs(used.y - pos.y) < 5
                )
            );
        },

        snapToGrid(x: number, y: number) {
            const gridPositions = this.getGridPositions();
            let closestPosition = gridPositions[0];
            let minDistance = Number.MAX_VALUE;

            for (const pos of gridPositions) {
                const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPosition = pos;
                }
            }

            return closestPosition;
        },

        isPositionOccupied(x: number, y: number, excludeAppId?: string) {
            return this.apps.some((app: LaptopApp) => {
                if (excludeAppId && app.id === excludeAppId) return false;
                if (!app.desktopPosition) return false;

                return Math.abs(app.desktopPosition.x - x) < 5 && Math.abs(app.desktopPosition.y - y) < 5;
            });
        },

        openFileInReader(fileId: string) {
            this.openApp('fileReader');
            this.currentDocument = fileId;
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('openFile', {
                    detail: { fileId }
                }));
            }
        }
    },

    getters: {
        openApps(): LaptopApp[] {
            return this.apps.filter((app: LaptopApp) => app.isOpen && !app.minimized);
        },

        minimizedApps(): LaptopApp[] {
            return this.apps.filter((app: LaptopApp) => app.isOpen && app.minimized);
        },

        maximizedApps(): LaptopApp[] {
            return this.apps.filter((app: LaptopApp) => app.isOpen && app.maximized);
        },

        taskbarApps(): LaptopApp[] {
            return this.apps.filter((app: LaptopApp) => app.isOpen);
        },

        availableApps(): LaptopApp[] {
            const gameStore = useGameStore();
            const missionContent = gameStore.currentMissionContent;
            const customApps = missionContent?.customApps || [];

            return this.apps.filter((app: LaptopApp) => {
                const missionApp = customApps.find((mApp: MissionApp) => mApp.id === app.id);
                const builtInApp = getAppById(app.id);
                const appConfig = missionApp || builtInApp;

                return appConfig?.showOnDesktop !== false;
            });
        }
    }
});