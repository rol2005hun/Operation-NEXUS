<template>
    <div class="verification-page">
        <div class="background-floating-elements">
            <div class="bg-element bg-dot-1"></div>
            <div class="bg-element bg-dot-2"></div>
            <div class="bg-element bg-dot-3"></div>
            <div class="bg-element bg-dot-4"></div>
            <div class="bg-element bg-dot-5"></div>
            <div class="bg-element bg-line-1"></div>
            <div class="bg-element bg-line-2"></div>
            <div class="bg-element bg-hex-1"></div>
            <div class="bg-element bg-hex-2"></div>
        </div>

        <div class="verify-container">
            <div class="floating-elements">
                <div class="element dot-1"></div>
                <div class="element dot-2"></div>
                <div class="element dot-3"></div>
                <div class="element dot-4"></div>
                <div class="element line-1"></div>
                <div class="element line-2"></div>
                <div class="element hex-1"></div>
                <div class="element hex-2"></div>
            </div>

            <div class="verify-content">
                <div class="header">
                    <div class="logo-container">
                        <div class="logo-icon">
                            <span class="logo-text">
                                <span class="logo-o">O</span><span class="logo-n">N</span>
                            </span>
                        </div>
                        <div class="logo-title-container">
                            <span class="logo-operation">Operation:</span>
                            <span class="logo-nexus">NEXUS</span>
                        </div>
                    </div>
                    <div class="agency-subtitle">Email Change Verification</div>
                    <div class="security-badge">
                        <span class="badge-icon">🔒</span>
                        <span class="badge-text">SECURE CHANNEL</span>
                    </div>
                </div>

                <div class="verification-status">
                    <div v-if="status === 'verifying'" class="status-loading">
                        <div class="loading-spinner"></div>
                        <h2>🔐 Verifying Email Change...</h2>
                        <p>Please wait while we verify your new email address.</p>
                    </div>

                    <div v-else-if="status === 'success'" class="status-success">
                        <div class="success-icon">✓</div>
                        <h2>📧 Email Successfully Updated!</h2>
                        <p>Your email address has been successfully changed to:</p>
                        <div class="new-email">{{ newEmail }}</div>
                        <p>You can now return to your agent settings or continue your investigation.</p>
                        <div class="action-buttons">
                            <button @click="goToSettings" class="btn btn-primary">
                                <span class="btn-icon">⚙️</span>
                                Go to Settings
                            </button>
                            <button @click="goToHome" class="btn btn-secondary">
                                <span class="btn-icon">🏠</span>
                                Return to Dashboard
                            </button>
                        </div>
                    </div>

                    <div v-else-if="status === 'error'" class="status-error">
                        <div class="error-icon">⚠</div>
                        <h2>🚫 Verification Failed</h2>
                        <p>{{ errorMessage }}</p>
                        <p>The verification link may have expired or is invalid. Please request a new email change from
                            your settings.</p>
                        <div class="action-buttons">
                            <button @click="goToSettings" class="btn btn-primary">
                                <span class="btn-icon">⚙️</span>
                                Go to Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const status = ref<'verifying' | 'success' | 'error'>('verifying');
const newEmail = ref('');
const errorMessage = ref('');

const verifyEmailChange = async () => {
    try {
        const token = route.query.token as string;

        if (!token) {
            status.value = 'error';
            errorMessage.value = 'No verification token provided';
            return;
        }

        const response = await $fetch<{
            success: boolean;
            message?: string;
            newEmail?: string;
        }>('/api/email-change/verify', {
            method: 'GET',
            query: { token }
        });

        if (response.success) {
            status.value = 'success';
            newEmail.value = response.newEmail || '';
        } else {
            status.value = 'error';
            errorMessage.value = response.message || 'Verification failed';
        }
    } catch (error: any) {
        status.value = 'error';
        errorMessage.value = error.data?.message || 'An unexpected error occurred';
    }
};

const goToSettings = () => {
    router.push('/settings');
};

const goToHome = () => {
    router.push('/');
};

onMounted(() => {
    verifyEmailChange();
});

useHead({
    title: 'Email Change Verification - Operation: NEXUS'
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/verification-pages';
</style>