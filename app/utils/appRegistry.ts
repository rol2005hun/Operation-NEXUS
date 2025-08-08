export const builtInApps: MissionApp[] = [
    {
        id: 'jobDescription',
        name: 'Job Description',
        icon: '💼',
        type: 'surveillance',
        description: 'Investigation briefing and case details',
        builtIn: true,
        default: true,
        component: 'JobDescription'
    },
    {
        id: 'evidenceLocker',
        name: 'Evidence Locker',
        icon: '🔍',
        type: 'forensic',
        description: 'Evidence collection and analysis',
        builtIn: true,
        default: true,
        component: 'EvidenceLocker/EvidenceLocker'
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: '⚙️',
        type: 'monitoring',
        description: 'System settings and customization',
        showOnDesktop: false,
        builtIn: true,
        default: true,
        component: 'Settings'
    },
    {
        id: 'secureMail',
        name: 'Secure Mail',
        icon: '📧',
        type: 'communication',
        description: 'Secure email client for investigation communications',
        builtIn: true,
        component: 'SecureMail'
    },
    {
        id: 'cipherChat',
        name: 'Cipher Chat',
        icon: '💬',
        type: 'communication',
        description: 'Messaging application',
        builtIn: true,
        component: 'CipherChat/CipherChat'
    },
    {
        id: 'cryptoCracker',
        name: 'Crypto Cracker',
        icon: '🔓',
        type: 'forensic',
        description: 'Advanced cryptographic analysis and cipher decryption tool',
        builtIn: true,
        component: 'CryptoCracker'
    },
    {
        id: 'fileReader',
        name: 'File Reader',
        icon: '📄',
        type: 'forensic',
        description: 'File viewer for various document types',
        builtIn: true,
        component: 'FileReader'
    }
];

export const getDefaultApps = (): string[] => {
    return builtInApps.filter(app => app.default === true).map(app => app.id);
};

export const getComponentForApp = (appId: string, missionApp?: MissionApp): string => {
    if (missionApp?.component) {
        return missionApp.component;
    }

    const builtInApp = getAppById(appId);
    if (builtInApp?.component) {
        return builtInApp.component;
    }

    return 'Default';
};

const modules = import.meta.glob('../components/apps/**/*.vue');

export const loadComponent = async (componentName: string): Promise<Component> => {
    const normalizedName = componentName.toLowerCase();

    const matchedEntry = Object.entries(modules).find(([path]) => {
        const relativePath = path
            .replace(/^.*\/components\/apps\//i, '')
            .replace('.vue', '')
            .toLowerCase();

        return relativePath === normalizedName;
    });

    if (!matchedEntry) {
        throw new Error(`Component not found: ${componentName}`);
    }

    const importFn = matchedEntry[1];
    const mod = await importFn() as { default: Component };
    return mod.default || mod;
};

const dynamicComponentRegistry: Record<string, () => Promise<Component>> = {};

export const loadComponentWithRegistry = async (componentPath: string): Promise<Component> => {
    const registeredImport = dynamicComponentRegistry[componentPath];
    if (registeredImport) {
        try {
            return await registeredImport();
        } catch (error) {
            console.error(`Failed to load registered component "${componentPath}":`, error);
        }
    }

    return loadComponent(componentPath);
};

export const preloadBuiltInComponents = async (): Promise<void> => {
    await Promise.all(
        builtInApps
            .filter(app => typeof app.component === 'string')
            .map(app =>
                loadComponent(app.component as string).catch(err => {
                    console.warn(`Failed to preload component ${app.component}:`, err);
                })
            )
    );
};

export const getAppById = (appId: string): MissionApp | undefined => {
    return builtInApps.find(app => app.id === appId);
};