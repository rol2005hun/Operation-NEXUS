<template>
    <div class="laptop-screen" @contextmenu.prevent>
        <div class="laptop-frame">
            <div class="screen">
                <div class="desktop" @contextmenu="showContextMenu">
                    <div class="desktop-icons">
                        <div v-for="app in laptopStore.availableApps.filter(a => a.desktopPosition)" :key="app.id"
                            class="desktop-icon" :class="{ 'dragging': dragging && dragAppId === app.id }" :style="{
                                position: 'absolute',
                                left: app.desktopPosition!.x + 'px',
                                top: app.desktopPosition!.y + 'px'
                            }" @mousedown="startDrag($event, app.id)" @dblclick="laptopStore.openApp(app.id)">
                            <div class="icon">{{ app.icon }}</div>
                            <span class="icon-label">{{ app.name }}</span>
                        </div>
                    </div>

                    <div class="windows-container">
                        <Window v-for="app in laptopStore.openApps" :key="app.id" :app="app"
                            @close="laptopStore.closeApp(app.id)" @minimize="laptopStore.minimizeApp(app.id)"
                            @maximize="laptopStore.maximizeApp(app.id)" @focus="laptopStore.bringToFront(app.id)" />
                    </div>

                    <div class="taskbar">
                        <div class="taskbar-left">
                            <button class="start-button" @click="toggleStartMenu">
                                <div class="nexus-logo">
                                    <div class="logo-diamond">◆</div>
                                    <div class="logo-lines">
                                        <span class="line line-1"></span>
                                        <span class="line line-2"></span>
                                        <span class="line line-3"></span>
                                    </div>
                                </div>
                                <span class="nexus-text" @click.stop="toggleStartMenu">NEXUS</span>
                            </button>
                        </div>

                        <div class="taskbar-center">
                            <div v-for="app in laptopStore.taskbarApps" :key="app.id" class="taskbar-app"
                                :class="{ minimized: app.minimized }"
                                @click="app.minimized ? laptopStore.openApp(app.id) : laptopStore.bringToFront(app.id)">
                                <span class="app-icon">{{ app.icon }}</span>
                                <span class="app-name">{{ app.name }}</span>
                            </div>
                        </div>

                        <div class="taskbar-right">

                            <div class="system-time">
                                {{ currentTime }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="kbd-hint">
            <span><kbd>ESC</kbd> to exit</span>
            <span><kbd>F11</kbd> to toggle fullscreen</span>
        </div>

        <FullscreenModal />
        
        <MissionCompletionModal />

        <NexusProcessingModal :is-visible="nexusProcessingStore.showProcessingModal"
            :current-step="nexusProcessingStore.currentStep" :processing-status="nexusProcessingStore.processingStatus"
            :processing-text="nexusProcessingStore.processingText" :dot-index="nexusProcessingStore.dotIndex"
            :processing-error="nexusProcessingStore.processingError" @retry="nexusProcessingStore.retryProcessing"
            @cancel="nexusProcessingStore.returnToMainMenu" @close="nexusProcessingStore.cancelProcessing" />

        <ContextMenu ref="contextMenuRef" @refresh="handleRefresh" @arrangeIcons="handleArrangeIcons"
            @resetWindows="handleResetWindows" />

        <StartMenu ref="startMenuRef" />
    </div>
</template>

<script setup lang="ts">
import ContextMenu from '@/components/ContextMenu.vue';
import StartMenu from '@/components/StartMenu.vue';
import NexusProcessingModal from '@/components/NexusProcessingModal.vue';

const laptopStore = useLaptopStore();
const gameStore = useGameStore();
const nexusProcessingStore = useNexusProcessingStore();

const currentTime = ref('');
const dragging = ref(false);
const dragAppId = ref<string | null>(null);
const dragOffset = ref({ x: 0, y: 0 });
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);
const startMenuRef = ref<InstanceType<typeof StartMenu> | null>(null);

let timeInterval: NodeJS.Timeout | null = null;

const savedWallpaper = useCookie('nexus-custom-wallpaper', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 365 * 10
});

onMounted(() => {
    laptopStore.initialize();
    loadSavedWallpaper();
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
    window.addEventListener('keydown', handleKeyPress);
    preloadBuiltInComponents();
});

const loadSavedWallpaper = () => {
    if (savedWallpaper.value) {
        nextTick(() => {
            applyToDesktop(savedWallpaper.value);
        });
    }
};

const applyToDesktop = (imageUrl: string) => {
    const desktop = document.querySelector('.desktop') as HTMLElement;
    if (desktop) {
        if (imageUrl) {
            desktop.style.backgroundImage = `url('${imageUrl}')`;
            desktop.style.backgroundSize = 'cover';
            desktop.style.backgroundPosition = 'center';
            desktop.style.backgroundRepeat = 'no-repeat';
        } else {
            desktop.style.backgroundImage = '';
            desktop.style.backgroundSize = '';
            desktop.style.backgroundPosition = '';
            desktop.style.backgroundRepeat = '';
        }
    }
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const exitLaptop = () => {
    const currentMission = gameStore.currentMission;
    const progress = gameStore.currentProgress;

    const missionId = currentMission;
    const isCompleted = progress?.caseStatus === 'completed';

    gameStore.exitLaptop();

    if (missionId && isCompleted) {
        window.dispatchEvent(new CustomEvent('missionCompleted', {
            detail: { missionId: missionId }
        }));
    }
};

const showContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    contextMenuRef.value?.showMenu(event);
};

const toggleStartMenu = () => {
    startMenuRef.value?.toggleMenu();
};

const handleRefresh = () => {
    laptopStore.apps.forEach(app => {
        if (app.isOpen) {
            laptopStore.closeApp(app.id);
        }
    });
    laptopStore.initialize();
};

const handleArrangeIcons = () => {
    const gridSize = 120;
    const startX = 20;
    const startY = 20;

    laptopStore.availableApps.forEach((app, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = startX + (col * gridSize);
        const y = startY + (row * gridSize);
        laptopStore.updateDesktopIconPosition(app.id, x, y);
    });
};

const handleResetWindows = () => {
    laptopStore.apps.forEach(app => {
        if (app.isOpen) {
            laptopStore.closeApp(app.id);
        }
    });
};

const startDrag = (event: MouseEvent, appId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const app = laptopStore.apps.find(a => a.id === appId);
    if (!app) return;

    dragging.value = true;
    dragAppId.value = appId;

    const rect = (event.target as HTMLElement).closest('.desktop-icon')?.getBoundingClientRect();
    if (rect) {
        dragOffset.value = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event: MouseEvent) => {
    if (!dragging.value || !dragAppId.value) return;

    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    const desktopRect = desktop.getBoundingClientRect();

    const newX = event.clientX - desktopRect.left - dragOffset.value.x;
    const newY = event.clientY - desktopRect.top - dragOffset.value.y;

    const iconWidth = 80;
    const iconHeight = 100;

    const boundedX = Math.max(0, Math.min(newX, desktopRect.width - iconWidth));
    const boundedY = Math.max(0, Math.min(newY, desktopRect.height - iconHeight - 50));

    laptopStore.updateDesktopIconPosition(dragAppId.value, boundedX, boundedY);
};

const onMouseUp = () => {
    if (dragging.value && dragAppId.value) {
        const app = laptopStore.apps.find(a => a.id === dragAppId.value);
        if (app && app.desktopPosition) {
            const snappedPosition = laptopStore.snapToGrid(app.desktopPosition.x, app.desktopPosition.y);

            if (snappedPosition) {
                if (laptopStore.isPositionOccupied(snappedPosition.x, snappedPosition.y, dragAppId.value)) {
                    const availablePositions = laptopStore.getAvailableGridPositions();
                    if (availablePositions.length > 0) {
                        let closestAvailable = availablePositions[0];
                        let minDistance = Number.MAX_VALUE;

                        for (const pos of availablePositions) {
                            if (!app.desktopPosition) continue;
                            const distance = Math.sqrt(
                                Math.pow(app.desktopPosition.x - pos.x, 2) +
                                Math.pow(app.desktopPosition.y - pos.y, 2)
                            );
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestAvailable = pos;
                            }
                        }

                        if (closestAvailable) {
                            laptopStore.updateDesktopIconPosition(dragAppId.value, closestAvailable.x, closestAvailable.y);
                        }
                    }
                } else {
                    laptopStore.updateDesktopIconPosition(dragAppId.value, snappedPosition.x, snappedPosition.y);
                }
            }
        }
    }

    dragging.value = false;
    dragAppId.value = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
};

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        exitLaptop();
    }
};

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
    window.removeEventListener('keydown', handleKeyPress);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    nexusProcessingStore.cleanup();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/LaptopScreen';
</style>