export interface GameState {
    currentMission: string | null;
    missions: Mission[];
    missionContents: Record<string, MissionContent>;
    isInLaptop: boolean;
    progress: Record<string, MissionProgress>;
}