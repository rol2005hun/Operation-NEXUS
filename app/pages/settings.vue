<template>
    <div class="settings-page">
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

        <div class="settings-container">
            <button @click="goBack" class="back-to-system-btn">
                <span class="back-icon">←</span>
            </button>

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

            <div class="settings-header">
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
                <div class="agency-subtitle">Agent Settings Portal</div>
                <div class="security-badge">
                    <span class="badge-icon">🔒</span>
                    <span class="badge-text">CONFIDENTIAL</span>
                </div>
            </div>

            <div class="settings-form">
                <div class="form-header">
                    <h2>⚙️ Agent Settings Portal</h2>
                    <p class="form-subtitle">Manage your profile, security, and premium subscription</p>
                </div>

                <div class="settings-grid">
                    <div class="premium-column">
                        <div class="column-header">
                            <h3>💎 Premium Subscription</h3>
                            <p>Unlock premium features and support development</p>
                        </div>

                        <div class="premium-section">
                            <div class="subscription-status">
                                <div class="status-card" :class="{ 'premium': isPremiumUser }">
                                    <div class="status-icon">
                                        {{ isPremiumUser ? '💎' : '🆓' }}
                                    </div>
                                    <div class="status-info">
                                        <h4>{{ isPremiumUser ? 'Premium Agent' : 'Standard Agent' }}</h4>
                                        <p v-if="isPremiumUser">
                                            You have access to all premium features!
                                            <span v-if="getExpirationDate()">
                                                (Expires: {{ getExpirationDate() }})
                                            </span>
                                            <span v-else class="lifetime">Lifetime Access</span>
                                        </p>
                                        <p v-else>Upgrade to premium for exclusive features and support development</p>
                                    </div>
                                </div>
                            </div>

                            <div class="premium-toggle" v-if="isPremiumUser">
                                <div class="form-group toggle-group">
                                    <label class="toggle-label">
                                        <span class="label-icon">⚡</span>
                                        Enable Premium Features
                                    </label>
                                    <div class="toggle-wrapper">
                                        <label class="toggle-switch">
                                            <input type="checkbox" v-model="premiumEnabled"
                                                @change="togglePremiumUsage" />
                                            <span class="slider"></span>
                                        </label>
                                        <small class="toggle-description">Turn on/off premium functionality</small>
                                    </div>
                                </div>
                            </div>

                            <div class="premium-purchase" v-if="!isPremiumUser">
                                <div class="purchase-info">
                                    <h4>🚧 Premium Purchase - Demo Phase</h4>
                                    <p>Premium purchasing is currently disabled during the demo phase.</p>

                                    <div class="demo-support">
                                        <h5>💝 Support Development</h5>
                                        <p>
                                            Want to support the project? You can become a lifetime premium user by:
                                        </p>
                                        <ol>
                                            <li>Sending <strong>$1</strong> via Revolut, PayPal, or cryptocurrency</li>
                                            <li>Including your <strong class="copyable-id" @click="copyUserID"
                                                    :title="'Click to copy: ' + authStore.currentUser?.id">ID</strong>
                                                in the payment note</li>
                                            <li>Contacting the developer with proof of payment</li>
                                        </ol>
                                        <p>
                                            <small>
                                                While in demo phase, all supporters get <strong>lifetime premium
                                                    access</strong>!
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="premium-features">
                                <h4>Premium Features</h4>
                                <ul class="feature-list">
                                    <li :class="{ 'enabled': isPremiumUser && premiumEnabled }">
                                        <span class="feature-icon">🔓</span>
                                        Access to all premium missions
                                    </li>
                                    <li :class="{ 'enabled': isPremiumUser && premiumEnabled }">
                                        <span class="feature-icon">🎯</span>
                                        Advanced investigation tools
                                    </li>
                                    <li :class="{ 'enabled': isPremiumUser && premiumEnabled }">
                                        <span class="feature-icon">🔘</span>
                                        Disable the Support Development button
                                    </li>
                                    <li :class="{ 'enabled': isPremiumUser && premiumEnabled }">
                                        <span class="feature-icon">⚡</span>
                                        Priority support and early access to new features
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="profile-column">
                        <div class="column-header">
                            <h3>👤 Agent Profile Management</h3>
                            <p>Manage your personal information and security settings</p>
                        </div>

                        <div class="form-content">
                            <form @submit.prevent>
                                <div class="form-group">
                                    <label for="agentName">
                                        <span class="label-icon">🏷️</span>
                                        Full Agent Name
                                    </label>
                                    <div class="input-wrapper">
                                        <input id="agentName" v-model="userProfile.agentName" type="text"
                                            placeholder="e.g., Sarah Mitchell Chen" autocomplete="name"
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
                                        <input id="username" v-model="userProfile.username" type="text"
                                            placeholder="agent_sarah_m" autocomplete="username" class="form-input" />
                                        <div class="input-border"></div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="email">
                                        <span class="label-icon">📧</span>
                                        Official Email Address
                                    </label>
                                    <div class="input-wrapper">
                                        <input id="email" v-model="newEmail" type="email" placeholder="agent@nexus.gov"
                                            autocomplete="email" class="form-input" />
                                        <div class="input-border"></div>
                                    </div>
                                    <button v-if="newEmail && newEmail !== authStore.user?.email"
                                        @click="requestEmailChange" class="email-change-button" type="button"
                                        :disabled="isEmailChangeLoading">
                                        <span v-if="!isEmailChangeLoading" class="button-icon">📧</span>
                                        <span v-if="isEmailChangeLoading" class="loading-spinner"></span>
                                        {{ isEmailChangeLoading ? 'Sending...' : 'Send Verification Email' }}
                                    </button>
                                </div>
                            </form>

                            <form @submit.prevent>
                                <div class="security-section">
                                    <h3 class="section-subtitle">🔐 Security Clearance Update</h3>

                                    <div class="form-group">
                                        <label for="currentPassword">
                                            <span class="label-icon">🔑</span>
                                            Current Security Code
                                        </label>
                                        <div class="input-wrapper">
                                            <input id="currentPassword" v-model="passwordForm.currentPassword"
                                                :type="showCurrentPassword ? 'text' : 'password'"
                                                placeholder="Enter your current security code"
                                                autocomplete="current-password" class="form-input" />
                                            <button type="button"
                                                :class="['password-toggle', { 'password-visible': showCurrentPassword }]"
                                                @click="showCurrentPassword = !showCurrentPassword">
                                                <span class="eye-icon">👁</span>
                                            </button>
                                            <div class="input-border"></div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="newPassword">
                                            <span class="label-icon">🔒</span>
                                            New Security Code
                                        </label>
                                        <div class="input-wrapper">
                                            <input id="newPassword" v-model="passwordForm.newPassword"
                                                :type="showNewPassword ? 'text' : 'password'"
                                                placeholder="Minimum 6 secure characters" autocomplete="new-password"
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
                                            <span class="label-icon">✅</span>
                                            Confirm Security Code
                                        </label>
                                        <div class="input-wrapper">
                                            <input id="confirmPassword" v-model="passwordForm.confirmPassword"
                                                :type="showConfirmPassword ? 'text' : 'password'"
                                                placeholder="Re-enter new security code" autocomplete="new-password"
                                                class="form-input" />
                                            <button type="button"
                                                :class="['password-toggle', { 'password-visible': showConfirmPassword }]"
                                                @click="showConfirmPassword = !showConfirmPassword">
                                                <span class="eye-icon">👁</span>
                                            </button>
                                            <div class="input-border"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <div class="action-row primary-actions">
                                        <button @click="saveProfile" class="save-button">
                                            <div class="button-content">
                                                <span class="normal-state">
                                                    <span class="button-icon">💾</span>
                                                    Save Profile
                                                </span>
                                            </div>
                                        </button>

                                        <button @click="changePassword" class="password-button">
                                            <div class="button-content">
                                                <span class="normal-state">
                                                    <span class="button-icon">🔒</span>
                                                    Change Password
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    <div class="action-row secondary-actions">
                                        <button @click="goBack" class="back-button">
                                            <div class="button-content">
                                                <span class="normal-state">
                                                    <span class="button-icon">←</span>
                                                    Back to System
                                                </span>
                                            </div>
                                        </button>

                                        <button @click="logout" class="logout-button">
                                            <div class="button-content">
                                                <span class="normal-state">
                                                    <span class="button-icon">🚪</span>
                                                    Logout
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Transition name="message-slide">
                <div v-if="message.text" :class="['message', message.type]">
                    <span class="message-icon">
                        {{ message.type === 'success' ? '✅' : '⚠️' }}
                    </span>
                    <span class="message-text">{{ message.text }}</span>
                </div>
            </Transition>

            <div class="settings-footer">
                <div class="security-notice">
                    <span class="security-icon">🔒</span>
                    <span class="security-text">Encrypted Federal System • Authorized Personnel Only</span>
                </div>
                <div class="classification-level">
                    <span class="classification-badge">CONFIDENTIAL</span>
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
const { isPremiumUser, isPremiumEnabled, togglePremiumUsage: togglePremium, getExpirationDate } = usePremium();

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isEmailChangeLoading = ref(false);

const premiumEnabled = ref(isPremiumEnabled.value);

const userProfile = reactive({
    agentName: authStore.user?.agent?.name || '',
    username: authStore.user?.username || ''
});

const newEmail = ref(authStore.user?.email || '');

const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

const goBack = () => {
    router.push('/');
};

const saveProfile = async () => {
    try {
        const { updateProfile } = useUserProfile();
        const data = await updateProfile({
            agentName: userProfile.agentName,
            username: userProfile.username,
            email: authStore.user?.email || ''
        });

        if (data.success) {
            showMessage('Profile updated successfully!');
            await authStore.fetchProfile();
        } else {
            showMessage('Failed to update profile', 'error');
        }
    } catch (error) {
        showMessage('Failed to update profile', 'error');
    }
};

const requestEmailChange = async () => {
    if (!newEmail.value || newEmail.value === authStore.user?.email) {
        showMessage('Please enter a new email address', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    isEmailChangeLoading.value = true;

    try {
        const { requestEmailChange } = useUserProfile();
        const data = await requestEmailChange(newEmail.value);

        if (data.success) {
            showMessage('Verification email sent! Please check your new email address and click the verification link.');
            newEmail.value = authStore.user?.email || '';
        } else {
            showMessage(data.message || 'Failed to send verification email', 'error');
        }
    } catch (error: any) {
        const errorMessage = error.data?.message || error.message || 'Failed to send verification email';
        showMessage(errorMessage, 'error');
    } finally {
        isEmailChangeLoading.value = false;
    }
};

const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showMessage('New passwords do not match!', 'error');
        return;
    }

    if (passwordForm.newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return;
    }

    try {
        const { changePassword } = useUserProfile();
        const data = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

        if (data.success) {
            showMessage('Password changed successfully!');
            passwordForm.currentPassword = '';
            passwordForm.newPassword = '';
            passwordForm.confirmPassword = '';
        } else {
            showMessage('Failed to change password', 'error');
        }
    } catch (error) {
        showMessage('Failed to change password', 'error');
    }
};

const logout = () => {
    authStore.logout();
    router.push('/auth');
};

const loadPremiumSettings = () => {
    premiumEnabled.value = isPremiumEnabled.value;
};

const togglePremiumUsage = () => {
    const success = togglePremium(premiumEnabled.value);

    if (success) {
        if (premiumEnabled.value) {
            showMessage('Premium features enabled!');
        } else {
            showMessage('Premium features disabled.');
        }
    } else {
        showMessage('Only premium users can toggle premium features.', 'error');
        premiumEnabled.value = false;
    }
};

const copyUserID = async () => {
    try {
        const userID = authStore.currentUser?.id;
        if (userID) {
            await navigator.clipboard.writeText(userID);
            showMessage('User ID copied to clipboard!');
        } else {
            showMessage('No user ID available to copy', 'error');
        }
    } catch (error) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = authStore.currentUser?.id || '';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showMessage('User ID copied to clipboard!');
        } catch (fallbackError) {
            showMessage('Failed to copy ID to clipboard', 'error');
        }
    }
};

watch(isPremiumEnabled, (newValue) => {
    premiumEnabled.value = newValue;
});

useHead({
    title: 'Settings - Operation: NEXUS'
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/pages/settings';
</style>