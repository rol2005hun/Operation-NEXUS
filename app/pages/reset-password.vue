<template>
    <div class="auth-page">

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

        <div class="auth-container">

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

            <div class="auth-header">
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
                <div class="agency-subtitle">Digital Investigation Agency</div>
                <div class="security-badge">
                    <span class="badge-icon">🛡️</span>
                    <span class="badge-text">CLASSIFIED SYSTEM</span>
                </div>

                <div class="auth-tabs">
                    <button :class="{ active: mode === 'request' }" @click="switchMode('request')" class="tab-button">
                        <span class="tab-icon">📧</span>
                        <span class="tab-text">Request Reset</span>
                    </button>
                    <button v-if="mode === 'reset'" :class="{ active: mode === 'reset' }" class="tab-button">
                        <span class="tab-icon">🛡️</span>
                        <span class="tab-text">New Password</span>
                    </button>
                </div>
            </div>

            <Transition name="form-slide" mode="out-in">
                <div v-if="mode === 'request'" key="request" class="auth-form">
                    <div class="form-header">
                        <h2>🔑 Password Recovery Portal</h2>
                        <p class="form-subtitle">Enter your email to receive a secure password reset link</p>
                    </div>
                    <form @submit.prevent="handleForgotPassword" class="form-content">
                        <div class="form-group">
                            <label for="forgotEmail">
                                <span class="label-icon">📧</span>
                                Official Email Address
                            </label>
                            <div class="input-wrapper">
                                <input id="forgotEmail" v-model="forgotPasswordForm.email" type="email"
                                    placeholder="your.email@nexus.gov" autocomplete="email" required
                                    class="form-input" />
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <button type="submit" :disabled="authStore.isLoading" class="auth-button">
                            <div class="button-content">
                                <span v-if="authStore.isLoading" class="loading-state">
                                    <span class="spinner"></span>
                                    Sending Reset Link...
                                </span>
                                <span v-else class="normal-state">
                                    <span class="button-icon">📨</span>
                                    Send Recovery Link
                                </span>
                            </div>
                        </button>
                        <div class="form-footer">
                            <NuxtLink to="/auth" class="link-button">
                                ← Back to Agent Access
                            </NuxtLink>
                        </div>
                    </form>
                </div>

                <div v-else-if="mode === 'reset'" key="reset" class="auth-form">
                    <div class="form-header">
                        <h2>🛡️ Security Clearance Reset</h2>
                        <p class="form-subtitle">Enter your new security clearance code</p>
                    </div>
                    <form @submit.prevent="handleResetPassword" class="form-content">
                        <div class="form-group">
                            <label for="newPassword">
                                <span class="label-icon">🔒</span>
                                New Security Clearance Code
                            </label>
                            <div class="input-wrapper">
                                <input id="newPassword" v-model="resetPasswordForm.newPassword"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    placeholder="Minimum 6 secure characters" autocomplete="new-password" required
                                    class="form-input" />
                                <button type="button"
                                    :class="['password-toggle', { 'password-visible': showNewPassword }]"
                                    @click="showNewPassword = !showNewPassword">
                                    <span class="eye-icon">👁</span>
                                </button>
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">
                                <span class="label-icon">🔐</span>
                                Confirm New Code
                            </label>
                            <div class="input-wrapper">
                                <input id="confirmPassword" v-model="resetPasswordForm.confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    placeholder="Re-enter your new password" autocomplete="new-password" required
                                    class="form-input" />
                                <button type="button"
                                    :class="['password-toggle', { 'password-visible': showConfirmPassword }]"
                                    @click="showConfirmPassword = !showConfirmPassword">
                                    <span class="eye-icon">👁</span>
                                </button>
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <button type="submit" :disabled="authStore.isLoading" class="auth-button">
                            <div class="button-content">
                                <span v-if="authStore.isLoading" class="loading-state">
                                    <span class="spinner"></span>
                                    Updating Security Code...
                                </span>
                                <span v-else class="normal-state">
                                    <span class="button-icon">✅</span>
                                    Update Security Clearance
                                </span>
                            </div>
                        </button>
                        <div class="form-footer">
                            <NuxtLink to="/auth" class="link-button">
                                ← Back to Agent Access
                            </NuxtLink>
                        </div>
                    </form>
                </div>
            </Transition>

            <Transition name="message-slide">
                <div v-if="message.text" :class="['message', message.type]">
                    <span class="message-icon">
                        {{ message.type === 'success' ? '✅' : '⚠️' }}
                    </span>
                    <span class="message-text">{{ message.text }}</span>
                </div>
            </Transition>

            <div class="auth-footer">
                <div class="security-notice">
                    <span class="security-icon">🔒</span>
                    <span class="security-text">Encrypted Federal System • Authorized Personnel Only</span>
                </div>
                <div class="classification-level">
                    <span class="classification-badge">TOP SECRET</span>
                </div>
            </div>
        </div>

        <div class="background">
            <div class="grid-overlay"></div>
            <div class="gradient-overlay"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const mode = ref<'request' | 'reset'>('request');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const forgotPasswordForm = reactive({
    email: ''
});

const resetPasswordForm = reactive({
    newPassword: '',
    confirmPassword: ''
});

const resetToken = ref('');

const message = reactive({
    text: '',
    type: 'success' as 'success' | 'error'
});

const switchMode = (newMode: 'request' | 'reset') => {
    mode.value = newMode;
    message.text = '';
};

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    message.text = text;
    message.type = type;
    setTimeout(() => {
        message.text = '';
    }, 5000);
};

const handleForgotPassword = async () => {
    const result = await authStore.forgotPassword(forgotPasswordForm.email);

    if (result?.success) {
        showMessage(result.message || 'Password reset email sent successfully');
        forgotPasswordForm.email = '';
    } else {
        showMessage(result?.message || 'Failed to send reset email', 'error');
    }
};

const handleResetPassword = async () => {
    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (resetPasswordForm.newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    const result = await authStore.resetPassword(resetToken.value, resetPasswordForm.newPassword);

    if (result?.success) {
        showMessage(result.message || 'Password reset successfully');
        setTimeout(() => {
            router.push('/auth');
        }, 2000);
    } else {
        showMessage(result?.message || 'Failed to reset password', 'error');
    }
};

watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
        router.push('/');
    }
}, { immediate: true });

onMounted(() => {
    const token = route.query.token as string;

    if (token) {
        resetToken.value = token;
        switchMode('reset');
    }
});

useHead({
    title: 'Password Reset - Operation: NEXUS'
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/auth';
</style>
