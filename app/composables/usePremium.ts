export const usePremium = () => {
    const authStore = useAuthStore();

    const premiumEnabledCookie = useCookie('nexus-premium-enabled', {
        default: () => true,
        maxAge: 60 * 60 * 24 * 365 * 10
    });

    const isPremiumUser = computed(() => {
        return authStore.currentUser?.subscription?.type === 'premium';
    });

    const isPremiumEnabled = computed(() => {
        if (!isPremiumUser.value) return false;
        return premiumEnabledCookie.value;
    });

    const canAccessPremiumFeatures = computed(() => {
        return isPremiumUser.value && isPremiumEnabled.value;
    });

    const isPremiumExpired = computed(() => {
        if (!isPremiumUser.value) return false;

        const expiresAt = authStore.currentUser?.subscription.expiresAt;
        if (!expiresAt) return false;

        return new Date(expiresAt) < new Date();
    });

    const premiumStatusText = computed(() => {
        if (!isPremiumUser.value) return 'Free User';
        if (isPremiumExpired.value) return 'Premium Expired';
        if (!authStore.currentUser?.subscription.expiresAt) return 'Premium (Lifetime)';
        return 'Premium Active';
    });

    const togglePremiumUsage = (enabled: boolean) => {
        if (!isPremiumUser.value) return false;

        premiumEnabledCookie.value = enabled;

        return true;
    };

    const requiresPremium = (featureId: string): boolean => {
        const premiumFeatures = [
            'advanced-analytics',
            'premium-missions',
            'exclusive-themes',
            'priority-support',
            'advanced-tools'
        ];

        return premiumFeatures.includes(featureId);
    };

    const missionRequiresPremium = (missionId: string): boolean => {
        const premiumMissions = [
            'digital-ghost',
            'operation-blackout',
            'the-insider'
        ];

        return premiumMissions.includes(missionId);
    };

    const canAccessFeature = (featureId: string): boolean => {
        if (!requiresPremium(featureId)) return true;
        return canAccessPremiumFeatures.value;
    };

    const getExpirationDate = (): string | null => {
        if (!isPremiumUser.value || !authStore.currentUser?.subscription.expiresAt) {
            return null;
        }

        const date = new Date(authStore.currentUser.subscription.expiresAt);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return {
        isPremiumUser: readonly(isPremiumUser),
        isPremiumEnabled: readonly(isPremiumEnabled),
        canAccessPremiumFeatures: readonly(canAccessPremiumFeatures),
        isPremiumExpired: readonly(isPremiumExpired),
        premiumStatusText: readonly(premiumStatusText),
        togglePremiumUsage,
        requiresPremium,
        missionRequiresPremium,
        canAccessFeature,
        getExpirationDate
    };
};