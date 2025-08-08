<template>
    <div v-if="isVisible" class="context-menu-overlay" @click="hideMenu" @contextmenu.prevent>
        <div class="context-menu" :style="{ left: position.x + 'px', top: position.y + 'px' }" @click.stop>
            <button class="context-menu-item" @click="refreshDesktop">
                <span class="menu-icon">🔄</span>
                <span class="menu-text">Refresh</span>
                <span class="menu-shortcut">F5</span>
            </button>

            <div class="context-menu-item separator"></div>

            <button class="context-menu-item" @click="arrangeIcons">
                <span class="menu-icon">📋</span>
                <span class="menu-text">Arrange Icons</span>
            </button>

            <button class="context-menu-item" @click="resetWindows">
                <span class="menu-icon">🪟</span>
                <span class="menu-text">Reset Windows</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const isVisible = ref(false);
const position = reactive({ x: 0, y: 0 });

const emit = defineEmits<{
    refresh: [];
    arrangeIcons: [];
    resetWindows: [];
}>();

const showMenu = (event: MouseEvent) => {
    event.preventDefault();

    const menuWidth = 180;
    const menuHeight = 200;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = event.clientX;
    let y = event.clientY;

    if (x + menuWidth > windowWidth) {
        x = windowWidth - menuWidth - 10;
    }
    if (y + menuHeight > windowHeight) {
        y = windowHeight - menuHeight - 10;
    }

    position.x = x;
    position.y = y;
    isVisible.value = true;
};

const hideMenu = () => {
    isVisible.value = false;
};

const refreshDesktop = () => {
    emit('refresh');
    hideMenu();
};

const arrangeIcons = () => {
    emit('arrangeIcons');
    hideMenu();
};

const resetWindows = () => {
    emit('resetWindows');
    hideMenu();
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        hideMenu();
    }
    if (event.key === 'F5') {
        event.preventDefault();
        refreshDesktop();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});

defineExpose({
    showMenu,
    hideMenu
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/ContextMenu';
</style>