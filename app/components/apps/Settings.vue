<template>
    <div class="app-settings">
        <div class="settings-header">
            <h2>⚙️ Settings</h2>
            <p>Customize your NEXUS experience</p>
        </div>

        <div class="settings-content">
            <div class="settings-section">
                <h3>🖼️ Desktop Wallpaper</h3>
                <p>Customize your desktop background with a custom image URL</p>

                <div class="wallpaper-settings">
                    <div class="current-wallpaper">
                        <h4>Current Wallpaper:</h4>
                        <div class="wallpaper-preview" :style="{ backgroundImage: currentWallpaperStyle }">
                            <span v-if="!customWallpaper" class="default-label">Default Background</span>
                        </div>
                    </div>

                    <div class="wallpaper-input">
                        <label for="wallpaper-url">Custom Wallpaper URL:</label>
                        <div class="input-group">
                            <input id="wallpaper-url" v-model="wallpaperUrl" type="url"
                                placeholder="https://example.com/your-image.jpg" class="wallpaper-url-input"
                                @input="validateImageUrl" />
                            <button @click="applyWallpaper" class="apply-btn" :disabled="!wallpaperUrl || isLoading">
                                {{ isLoading ? 'Checking...' : 'Apply' }}
                            </button>
                        </div>
                        <small class="input-hint">
                            Supported formats: JPG, PNG, GIF, WebP
                        </small>
                    </div>

                    <div class="wallpaper-actions">
                        <button @click="resetToDefault" class="reset-btn" :disabled="!customWallpaper">
                            🔄 Reset to Default
                        </button>
                        <button @click="testImage" class="test-btn" :disabled="!wallpaperUrl || isLoading">
                            🔍 Test Image
                        </button>
                    </div>

                    <div v-if="errorMessage" class="error-message">
                        ⚠️ {{ errorMessage }}
                    </div>

                    <div v-if="successMessage" class="success-message">
                        ✅ {{ successMessage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const savedWallpaperCookie = useCookie('nexus-custom-wallpaper', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 365 * 10
});

const wallpaperUrl = ref('');
const customWallpaper = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const currentWallpaperStyle = computed(() => {
    if (customWallpaper.value) {
        return `url('${customWallpaper.value}')`;
    }
    return 'linear-gradient(45deg, rgba(0, 122, 204, 0.1) 0%, transparent 50%, rgba(0, 170, 68, 0.1) 100%)';
});

onMounted(() => {
    loadSavedWallpaperForPreview();
});

const loadSavedWallpaperForPreview = () => {
    if (savedWallpaperCookie.value) {
        customWallpaper.value = savedWallpaperCookie.value;
        wallpaperUrl.value = savedWallpaperCookie.value;
    }
};

const validateImageUrl = () => {
    errorMessage.value = '';
    successMessage.value = '';
};

const testImage = async () => {
    if (!wallpaperUrl.value) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const isValid = await checkImageExists(wallpaperUrl.value);
        if (isValid) {
            successMessage.value = 'Image is valid and accessible!';
        } else {
            errorMessage.value = 'Image could not be loaded. Please check the URL.';
        }
    } catch (error) {
        errorMessage.value = 'Failed to validate image URL.';
    } finally {
        isLoading.value = false;
    }
};

const applyWallpaper = async () => {
    if (!wallpaperUrl.value) return;

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const isValid = await checkImageExists(wallpaperUrl.value);
        if (isValid) {
            customWallpaper.value = wallpaperUrl.value;
            savedWallpaperCookie.value = wallpaperUrl.value;
            applyToDesktop(wallpaperUrl.value);
            successMessage.value = 'Wallpaper applied successfully!';
        } else {
            errorMessage.value = 'Image could not be loaded. Please check the URL and try again.';
        }
    } catch (error) {
        errorMessage.value = 'Failed to apply wallpaper. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

const resetToDefault = () => {
    customWallpaper.value = '';
    wallpaperUrl.value = '';
    savedWallpaperCookie.value = '';
    applyToDesktop('');
    successMessage.value = 'Wallpaper reset to default!';
    errorMessage.value = '';
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

const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        setTimeout(() => resolve(false), 10000);
    });
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/Settings';
</style>