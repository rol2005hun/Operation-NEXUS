function getAvailableMissionIds(): readonly string[] {
    const metadataModules = import.meta.glob('../../missions/*/metadata.ts', { eager: false });
    const indexModules = import.meta.glob('../../missions/*/index.ts', { eager: false });

    const missionIds = new Set<string>();

    Object.keys(metadataModules).forEach(path => {
        const match = path.match(/\.\.\/\.\.\/missions\/([^\/]+)\/metadata\.ts$/);
        if (match && match[1]) {
            missionIds.add(match[1]);
        }
    });

    Object.keys(indexModules).forEach(path => {
        const match = path.match(/\.\.\/\.\.\/missions\/([^\/]+)\/index\.ts$/);
        if (match && match[1]) {
            missionIds.add(match[1]);
        }
    });

    const validMissionIds = Array.from(missionIds).filter(id => id !== 'README');

    return validMissionIds as readonly string[];
}

const AVAILABLE_MISSION_IDS = getAvailableMissionIds();

export type MissionId = typeof AVAILABLE_MISSION_IDS[number];

async function loadMissionMetadata(missionId: string): Promise<Mission | null> {
    try {
        const metadataModule = await import(`../../missions/${missionId}/metadata.ts`);
        return metadataModule.missionMetadata || null;
    } catch (error) {
        try {
            const indexModule = await import(`../../missions/${missionId}/index.ts`);
            return indexModule.missionMetadata || null;
        } catch (fallbackError) {
            console.error(`Failed to load mission metadata for '${missionId}':`, error, fallbackError);
            return null;
        }
    }
}

async function loadMissionContentData(missionId: string): Promise<MissionContent | null> {
    try {
        const contentModule = await import(`../../missions/${missionId}/index.ts`);
        return contentModule.missionContent || null;
    } catch (error) {
        console.warn(`Mission content not available for '${missionId}':`, error);
        return null;
    }
}

export default async function registerMission(missionId: string): Promise<Mission | null> {
    if (!AVAILABLE_MISSION_IDS.includes(missionId as MissionId)) {
        console.warn(`Mission '${missionId}' not found in available missions`);
        return null;
    }

    try {
        return await loadMissionMetadata(missionId);
    } catch (error) {
        console.error(`Failed to load mission '${missionId}':`, error);
        return null;
    }
}

export async function loadMissionContent(missionId: string): Promise<MissionContent | null> {
    if (!AVAILABLE_MISSION_IDS.includes(missionId as MissionId)) {
        console.warn(`Mission content '${missionId}' not found in available missions`);
        return null;
    }

    try {
        return await loadMissionContentData(missionId);
    } catch (error) {
        console.error(`Failed to load mission content '${missionId}':`, error);
        return null;
    }
}

export async function getAllMissions(): Promise<Mission[]> {
    const missionPromises = AVAILABLE_MISSION_IDS.map(async (id) => {
        return await registerMission(id);
    });

    try {
        const missions = await Promise.all(missionPromises);
        const validMissions = missions.filter((mission): mission is Mission => mission !== null);

        return sortMissions(validMissions, 'clearance');
    } catch (error) {
        console.error('Failed to load missions:', error);
        return [];
    }
}

export function sortMissions(missions: Mission[], sortBy: 'clearance' | 'difficulty' | 'alphabetical' = 'clearance'): Mission[] {
    return missions.sort((a, b) => {
        switch (sortBy) {
            case 'clearance':
                if (a.securityClearance !== b.securityClearance) {
                    return a.securityClearance - b.securityClearance;
                }

                const difficultyOrder = {
                    'Rookie': 1,
                    'Agent': 2,
                    'Senior Agent': 3,
                    'Special Agent': 4,
                    'Supervisor': 5,
                    'Section Chief': 6,
                    'Deputy Director': 7,
                    'Director': 8
                };

                const aDiff = difficultyOrder[a.difficulty] || 0;
                const bDiff = difficultyOrder[b.difficulty] || 0;

                return aDiff - bDiff;

            case 'difficulty':
                const diffOrder = {
                    'Rookie': 1,
                    'Agent': 2,
                    'Senior Agent': 3,
                    'Special Agent': 4,
                    'Supervisor': 5,
                    'Section Chief': 6,
                    'Deputy Director': 7,
                    'Director': 8
                };

                const aDiffOnly = diffOrder[a.difficulty] || 0;
                const bDiffOnly = diffOrder[b.difficulty] || 0;

                if (aDiffOnly !== bDiffOnly) {
                    return aDiffOnly - bDiffOnly;
                }

                return a.securityClearance - b.securityClearance;

            case 'alphabetical':
                return a.title.localeCompare(b.title);

            default:
                return 0;
        }
    });
}

export function filterMissionsByClearance(missions: Mission[], userClearanceLevel: number): Mission[] {
    return missions.filter(mission => mission.securityClearance <= userClearanceLevel);
}

export async function getAvailableMissionsForUser(userClearanceLevel: number, sortBy: 'clearance' | 'difficulty' | 'alphabetical' = 'clearance'): Promise<Mission[]> {
    const allMissions = await getAllMissions();
    const availableMissions = filterMissionsByClearance(allMissions, userClearanceLevel);
    return sortMissions(availableMissions, sortBy);
}