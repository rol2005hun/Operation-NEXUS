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
                    <div class="agency-subtitle">Account Verification</div>
                    <div class="security-badge">
                        <span class="badge-icon">🔒</span>
                        <span class="badge-text">SECURE CHANNEL</span>
                    </div>
                </div>

                <div class="verification-status">
                    <div v-if="status === 'verifying'" class="status-loading">
                        <div class="loading-spinner"></div>
                        <h2>🔐 Verifying Account...</h2>
                        <p>Please wait while we activate your agent account.</p>
                    </div>

                    <div v-else-if="status === 'success'" class="status-success">
                        <div class="success-icon">✓</div>
                        <h2>🎯 Account Successfully Activated!</h2>
                        <p>Welcome to Operation: NEXUS, Agent {{ agentName }}!</p>
                        <p>Your account has been verified and you are now logged in.</p>
                        <div class="action-buttons">
                            <button @click="goToHome" class="btn btn-primary">
                                <span class="btn-icon">🎯</span>
                                Start Mission
                            </button>
                        </div>
                    </div>

                    <div v-else-if="status === 'error'" class="status-error">
                        <div class="error-icon">⚠</div>
                        <h2>🚫 Verification Failed</h2>
                        <p>{{ errorMessage }}</p>
                        <p>The verification link may have expired or is invalid. Please register again or contact
                            support.</p>
                        <div class="action-buttons">
                            <button @click="goToRegister" class="btn btn-primary">
                                <span class="btn-icon">📝</span>
                                Register Again
                            </button>
                            <button @click="goToLogin" class="btn btn-secondary">
                                <span class="btn-icon">🔑</span>
                                Back to Login
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
const authStore = useAuthStore();

const status = ref<'verifying' | 'success' | 'error'>('verifying');
const agentName = ref('');
const errorMessage = ref('');

const verifyAccount = async () => {
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
            user?: any;
            token?: string;
        }>('/api/auth/verify-account', {
            method: 'POST',
            body: { token }
        });

        if (response.success && response.user && response.token) {
            status.value = 'success';
            agentName.value = response.user.agent?.name || '';

            authStore.setUser(response.user);
            authStore.setToken(response.token);
        } else {
            status.value = 'error';
            errorMessage.value = response.message || 'Verification failed';
        }
    } catch (error: any) {
        status.value = 'error';
        errorMessage.value = error.data?.message || 'An unexpected error occurred';
    }
};

const goToHome = () => {
    router.push('/');
};

const goToRegister = () => {
    router.push('/auth?mode=register');
};

const goToLogin = () => {
    router.push('/auth?mode=login');
};

onMounted(() => {
    verifyAccount();
});

useHead({
    title: 'Account Verification - Operation: NEXUS'
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/verification-pages';
</style>