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
                    <button :class="{ active: mode === 'login' }" @click="switchMode('login')" class="tab-button">
                        <span class="tab-icon">🔐</span>
                        <span class="tab-text">Agent Access</span>
                    </button>
                    <button :class="{ active: mode === 'register' }" @click="switchMode('register')" class="tab-button">
                        <span class="tab-icon">📋</span>
                        <span class="tab-text">Recruitment</span>
                    </button>
                </div>
            </div>

            <Transition name="form-slide" mode="out-in">
                <div v-if="mode === 'login'" key="login" class="auth-form">
                    <div class="form-header">
                        <h2>🎯 Agent Access Portal</h2>
                        <p class="form-subtitle">Enter your credentials to access classified systems</p>
                    </div>
                    <form @submit.prevent="handleLogin" class="form-content">
                        <div class="form-group">
                            <label for="identifier">
                                <span class="label-icon">👤</span>
                                Agent Identifier
                            </label>
                            <div class="input-wrapper">
                                <input id="identifier" v-model="loginForm.identifier" type="text"
                                    placeholder="agent.username or email@nexus.gov" autocomplete="username" required
                                    class="form-input" />
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password">
                                <span class="label-icon">🔑</span>
                                Security Clearance Code
                            </label>
                            <div class="input-wrapper">
                                <input id="password" v-model="loginForm.password"
                                    :type="showLoginPassword ? 'text' : 'password'" placeholder="••••••••••••"
                                    autocomplete="current-password" required class="form-input" />
                                <button type="button"
                                    :class="['password-toggle', { 'password-visible': showLoginPassword }]"
                                    @click="showLoginPassword = !showLoginPassword">
                                    <span class="eye-icon">👁</span>
                                </button>
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group remember-me-group">
                            <label for="rememberMe" class="remember-me-label">
                                <input id="rememberMe" v-model="loginForm.rememberMe" type="checkbox"
                                    class="remember-me-checkbox" />
                                <span class="checkbox-custom"></span>
                                <span class="remember-me-text">
                                    <span class="label-icon">🔒</span>
                                    Remember me (permanent login)
                                </span>
                            </label>
                        </div>
                        <div class="forgot-password-group">
                            <NuxtLink to="/reset-password" class="reset-password-link">
                                <span class="forgot-password-icon">🔑</span>
                                <span class="forgot-password-text">Forgot your password?</span>
                                <span class="forgot-password-arrow">→</span>
                            </NuxtLink>
                        </div>
                        <button type="submit" :disabled="authStore.isLoading" class="auth-button">
                            <div class="button-content">
                                <span v-if="authStore.isLoading" class="loading-state">
                                    <span class="spinner"></span>
                                    Authenticating Agent...
                                </span>
                                <span v-else class="normal-state">
                                    <span class="button-icon">🚀</span>
                                    Initiate System Access
                                </span>
                            </div>
                        </button>
                    </form>
                </div>

                <div v-else key="register" class="auth-form">
                    <div class="form-header">
                        <h2>📋 Agent Recruitment Portal</h2>
                        <p class="form-subtitle">Join our elite team of digital investigators</p>
                    </div>
                    <form @submit.prevent="handleRegister" class="form-content">
                        <div class="form-group">
                            <label for="agentName">
                                <span class="label-icon">🏷️</span>
                                Full Agent Name
                            </label>
                            <div class="input-wrapper">
                                <input id="agentName" v-model="registerForm.agentName" type="text"
                                    placeholder="e.g., Sarah Mitchell Chen" autocomplete="name" required
                                    class="form-input" />
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="username">
                                <span class="label-icon">👤</span>
                                Agent Username
                            </label>
                            <div class="input-wrapper">
                                <input id="username" v-model="registerForm.username" type="text"
                                    placeholder="agent_sarah_m" autocomplete="username" required class="form-input" />
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">
                                <span class="label-icon">📧</span>
                                Official Email Address
                            </label>
                            <div class="input-wrapper">
                                <input id="email" v-model="registerForm.email" type="email"
                                    placeholder="sarah.chen@nexus.gov" autocomplete="email" required
                                    class="form-input" />
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password">
                                <span class="label-icon">🔒</span>
                                Security Clearance Code
                            </label>
                            <div class="input-wrapper">
                                <input id="password" v-model="registerForm.password"
                                    :type="showRegisterPassword ? 'text' : 'password'"
                                    placeholder="Minimum 6 secure characters" autocomplete="new-password" required
                                    class="form-input" />
                                <button type="button"
                                    :class="['password-toggle', { 'password-visible': showRegisterPassword }]"
                                    @click="showRegisterPassword = !showRegisterPassword">
                                    <span class="eye-icon">👁</span>
                                </button>
                                <div class="input-border"></div>
                            </div>
                        </div>
                        <div class="form-group terms-agreement-group">
                            <label for="acceptedTerms" class="terms-agreement-label">
                                <input id="acceptedTerms" v-model="registerForm.acceptedTerms" type="checkbox"
                                    class="terms-checkbox" required />
                                <span class="checkbox-custom"></span>
                                <span class="terms-text">
                                    <span class="label-icon">📋</span>
                                    By registering, you agree to our
                                    <a href="/terms" target="_blank" class="terms-link">Terms of Service</a>
                                    and
                                    <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>.
                                </span>
                            </label>
                        </div>
                        <button type="submit" :disabled="authStore.isLoading" class="auth-button">
                            <div class="button-content">
                                <span v-if="authStore.isLoading" class="loading-state">
                                    <span class="spinner"></span>
                                    Processing Application...
                                </span>
                                <span v-else class="normal-state">
                                    <span class="button-icon">🎖️</span>
                                    Join NEXUS Agency
                                </span>
                            </div>
                        </button>
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
const authStore = useAuthStore();
const router = useRouter();

const mode = ref<'login' | 'register'>('login');
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

const switchMode = (newMode: 'login' | 'register') => {
    mode.value = newMode;
    message.text = '';
};

const loginForm = reactive({
    identifier: '',
    password: '',
    rememberMe: false
});

const registerForm = reactive({
    username: '',
    email: '',
    password: '',
    agentName: '',
    acceptedTerms: false
});

const message = reactive({
    text: '',
    type: 'success' as 'success' | 'error'
});

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    message.text = text;
    message.type = type;
    setTimeout(() => {
        message.text = '';
    }, 5000);
};

const handleLogin = async () => {
    const result = await authStore.login(loginForm);

    if (result?.success) {
        showMessage(result.message || 'Login successful');
        setTimeout(() => {
            router.push('/');
        }, 1500);
    } else {
        showMessage(result?.message || 'Login failed', 'error');
    }
};

const handleRegister = async () => {
    const result = await authStore.register(registerForm);

    if (result?.success) {
        if (result.verificationLink) {
            showMessage(`${result.message} Verification link: ${result.verificationLink}`, 'success');
        } else {
            showMessage(result.message || 'Verification email sent! Please check your inbox.', 'success');
        }

        mode.value = 'login';

        registerForm.agentName = '';
        registerForm.username = '';
        registerForm.email = '';
        registerForm.password = '';
        registerForm.acceptedTerms = false;
    } else {
        showMessage(result?.message || 'Registration failed', 'error');
    }
};

watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
        router.push('/');
    }
}, { immediate: true });

useHead({
    title: 'Auth - Operation: NEXUS'
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/auth';
</style>