<template>
    <Transition :name="transitionName" @enter="onEnter" @leave="onLeave" appear>
        <div v-if="!isMinimized" ref="windowElement" class="window" :class="{
            maximized: app.maximized,
            'window-entering': isEntering,
            'window-leaving': isLeaving,
            'is-dragging': isDragging,
            'is-resizing': isResizing
        }" :style="{
            left: app.position.x + 'px',
            top: app.position.y + 'px',
            width: app.size.width + 'px',
            height: app.size.height + 'px',
            zIndex: app.zIndex
        }" @mousedown="handleFocus">
            <div class="title-bar" @mousedown="startDrag">
                <div class="title-left">
                    <span class="app-icon">{{ app.icon }}</span>
                    <span class="app-title">{{ app.name }}</span>
                </div>

                <div class="title-controls">
                    <button class="control-btn minimize" @click="handleMinimize">
                        ─
                    </button>
                    <button class="control-btn maximize" @click="handleMaximize">
                        {{ app.maximized ? '🗗' : '🗖' }}
                    </button>
                    <button class="control-btn close" @click="handleClose">
                        ✕
                    </button>
                </div>
            </div>

            <div class="window-content">
                <div v-if="componentLoading" class="loading-indicator">
                    Loading app...
                </div>
                <div v-else-if="componentError" class="error-indicator">
                    Error: {{ componentError }}
                </div>
                <component v-else-if="dynamicComponent" :is="dynamicComponent" />
            </div>

            <div v-if="!app.maximized" class="resize-handle" @mousedown="startResize"></div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import type { WindowProps } from '#shared/types';

const TASKBAR_HEIGHT = 50;
const TITLE_BAR_HEIGHT = 32;
const MIN_VISIBLE_WIDTH = 100;
const MIN_WINDOW_WIDTH = 300;
const MIN_WINDOW_HEIGHT = 200;

const validateWindowPosition = (x: number, y: number, width: number, height: number) => {
    const windowsContainer = document.querySelector('.windows-container') as HTMLElement;
    if (!windowsContainer) {
        return { x, y };
    }

    const containerRect = windowsContainer.getBoundingClientRect();
    const maxY = containerRect.height - TITLE_BAR_HEIGHT;
    const maxX = containerRect.width - MIN_VISIBLE_WIDTH;
    const minX = -width + MIN_VISIBLE_WIDTH;

    return {
        x: Math.max(minX, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
    };
};

const props = defineProps<WindowProps>();

const emit = defineEmits<{
    close: []
    minimize: []
    maximize: []
    focus: []
}>();

const isDragging = ref(false);
const isResizing = ref(false);
const dynamicComponent = shallowRef<Component | null>(null);
const componentLoading = ref(false);
const componentError = ref<string | null>(null);
const isMinimized = ref(false);
const isEntering = ref(false);
const isLeaving = ref(false);
const windowElement = ref<HTMLElement>();
const dragStart = ref({ x: 0, y: 0 });
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 });

watch(() => props.app.minimized, (newVal) => {
    isMinimized.value = !!newVal;
});

watch(() => props.app.id, async (newAppId) => {
    if (!newAppId) return;
    componentLoading.value = true;
    componentError.value = null;
    dynamicComponent.value = null;

    const componentName = getComponentForApp(newAppId);

    try {
        const comp = await loadComponentWithRegistry(componentName);
        dynamicComponent.value = comp;
    } catch (error) {
        componentError.value = error instanceof Error ? error.message : String(error);
    } finally {
        componentLoading.value = false;
    }
}, { immediate: true });

const transitionName = computed(() => {
    if (isLeaving.value) return 'window-close';
    return 'window-open';
});

const handleFocus = () => {
    emit('focus');
};

const startDrag = (event: MouseEvent) => {
    if (event.target === event.currentTarget && !props.app.maximized) {
        isDragging.value = true;
        dragStart.value = {
            x: event.clientX - props.app.position.x,
            y: event.clientY - props.app.position.y
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    }
};

const handleDrag = (event: MouseEvent) => {
    if (isDragging.value) {
        const newX = event.clientX - dragStart.value.x;
        const newY = event.clientY - dragStart.value.y;
        const validatedPosition = validateWindowPosition(newX, newY, props.app.size.width, props.app.size.height);

        Object.assign(props.app.position, validatedPosition);
    }
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
};

const startResize = (event: MouseEvent) => {
    isResizing.value = true;
    resizeStart.value = {
        x: event.clientX,
        y: event.clientY,
        width: props.app.size.width,
        height: props.app.size.height
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
};

const handleResize = (event: MouseEvent) => {
    if (isResizing.value) {
        const deltaX = event.clientX - resizeStart.value.x;
        const deltaY = event.clientY - resizeStart.value.y;

        const windowsContainer = document.querySelector('.windows-container') as HTMLElement;
        const containerRect = windowsContainer ? windowsContainer.getBoundingClientRect() :
            { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT };

        const maxWidth = containerRect.width - props.app.position.x;
        const maxHeight = containerRect.height - props.app.position.y;

        const newWidth = Math.max(MIN_WINDOW_WIDTH, Math.min(maxWidth, resizeStart.value.width + deltaX));
        const newHeight = Math.max(MIN_WINDOW_HEIGHT, Math.min(maxHeight, resizeStart.value.height + deltaY));

        Object.assign(props.app.size, { width: newWidth, height: newHeight });
    }
};

const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
};

const handleMinimize = () => {
    isLeaving.value = true;
    setTimeout(() => {
        emit('minimize');
        isLeaving.value = false;
    }, 250);
};

const handleMaximize = () => {
    emit('maximize');
};

const handleClose = () => {
    isLeaving.value = true;
    setTimeout(() => {
        emit('close');
        isLeaving.value = false;
    }, 200);
};

const onEnter = (el: Element) => {
    isEntering.value = true;
    setTimeout(() => {
        isEntering.value = false;
    }, 300);
};

const onLeave = (el: Element) => {
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/Window';
</style>