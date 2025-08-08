import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: (): GameState => ({
        currentMission: null,
        isInLaptop: false,
        missions: [],
        missionContents: {},
        progress: {}
    }),

    actions: {
        async initializeMissions() {
            if (this.missions.length === 0) {
                try {
                    this.missions = await getAllMissions();
                } catch (error) {
                    console.error('Failed to initialize missions:', error);
                }
            }
        },

        async selectMission(missionId: string) {
            const mission = this.missions.find(s => s.id === missionId);
            if (!mission || !mission.available || mission.securityClearance > this.agent.clearanceLevel) {
                return;
            }

            this.currentMission = missionId;
            this.isInLaptop = true;

            if (!this.missionContents[missionId]) {
                const content = await loadMissionContent(missionId);
                if (content) {
                    this.missionContents[missionId] = content;
                }
            }

            const laptopStore = useLaptopStore();
            laptopStore.initializeAppsForMission();

            if (!this.progress[missionId]) {
                this.progress[missionId] = {
                    emailsRead: [],
                    chatsRead: [],
                    evidenceFound: [],
                    filesExamined: [],
                    suspectsIdentified: [],
                    timelineBuilt: false,
                    primarySuspectConfirmed: false,
                    caseStatus: 'briefing',
                    investigationScore: 0,
                    hintsUsed: 0,
                    markedEvidence: [],
                    emailUIStates: {},
                    deletedEmails: [],
                    activeEmailFolder: 'inbox',
                    selectedEmail: null,
                    emailSearchQuery: '',
                    chatUIStates: {},
                    deletedChats: [],
                    permanentlyDeletedChats: [],
                    activeChatId: null,
                    chatFilter: 'chats',
                    customChats: [],
                    chatSearchQuery: ''
                };
            } else {
                const progress = this.progress[missionId];
                
                if (!progress.emailUIStates) progress.emailUIStates = {};
                if (!progress.deletedEmails) progress.deletedEmails = [];
                if (!progress.activeEmailFolder) progress.activeEmailFolder = 'inbox';
                if (progress.selectedEmail === undefined) progress.selectedEmail = null;
                if (!progress.emailSearchQuery) progress.emailSearchQuery = '';
                if (!progress.chatUIStates) progress.chatUIStates = {};
                if (!progress.deletedChats) progress.deletedChats = [];
                if (!progress.permanentlyDeletedChats) progress.permanentlyDeletedChats = [];
                if (progress.activeChatId === undefined) progress.activeChatId = null;
                if (!progress.chatFilter) progress.chatFilter = 'chats';
                if (!progress.customChats) progress.customChats = [];
                if (!progress.chatSearchQuery) progress.chatSearchQuery = '';
            }
        },

        exitLaptop() {
            this.isInLaptop = false;
            const laptopStore = useLaptopStore();
            laptopStore.apps = [];
        },

        markEmailRead(missionId: string, emailId: string) {
            if (!this.progress[missionId]) return;
            if (!this.progress[missionId].emailsRead.includes(emailId)) {
                this.progress[missionId].emailsRead.push(emailId);
                this.checkMissionCompletion(missionId);
            }
        },

        markChatRead(missionId: string, chatId: string) {
            if (!this.progress[missionId]) return;
            if (!this.progress[missionId].chatsRead.includes(chatId)) {
                this.progress[missionId].chatsRead.push(chatId);
                this.checkMissionCompletion(missionId);
            }
        },

        toggleEvidence(missionId: string, itemId: string) {
            if (!this.progress[missionId]) return;

            const progress = this.progress[missionId];
            const isMarked = progress.markedEvidence.includes(itemId);

            if (isMarked) {
                progress.markedEvidence = progress.markedEvidence.filter(id => id !== itemId);
                if (progress.evidenceFound.includes(itemId)) {
                    progress.evidenceFound = progress.evidenceFound.filter(id => id !== itemId);

                    progress.investigationScore = Math.max(0, progress.investigationScore - 50);
                }
            } else {
                progress.markedEvidence.push(itemId);

                const missionContent = this.missionContents[missionId];
                if (!missionContent) return;

                const isRealEvidence = this.isRealEvidence(missionContent, itemId);

                if (isRealEvidence && !progress.evidenceFound.includes(itemId)) {
                    progress.evidenceFound.push(itemId);

                    progress.investigationScore += 50;

                    this.checkMissionCompletion(missionId);
                }
            }
        },

        isRealEvidence(mission: MissionContent, itemId: string): boolean {
            return mission.evidenceItems?.includes(itemId) ?? false;
        },

        async markSuspectConfirmed(missionId: string, suspectId: string) {
            if (!this.progress[missionId]) return;
            const progress = this.progress[missionId];

            const missionContent = this.missionContents[missionId];
            if (missionContent) {
                const totalEvidence = missionContent.evidenceItems?.length || 0;
                const foundEvidence = progress.evidenceFound.length;
                const baseScore = totalEvidence > 0 ? Math.round((foundEvidence / totalEvidence) * 100) : 0;

                progress.investigationScore = Math.max(0, baseScore - 10);
            }

            progress.primarySuspectConfirmed = true;
            progress.suspectsIdentified.push(suspectId);
            this.checkMissionCompletion(missionId);
        },

        markFileExamined(missionId: string, fileId: string) {
            if (!this.progress[missionId]) return;
            if (!this.progress[missionId].filesExamined.includes(fileId)) {
                this.progress[missionId].filesExamined.push(fileId);
                this.checkMissionCompletion(missionId);
            }
        },

        async checkMissionCompletion(missionId: string) {
            const missionContent = this.missionContents[missionId];
            if (!missionContent || !this.progress[missionId]) return;

            const progress = this.progress[missionId];

            const totalRealEvidence = missionContent.evidenceItems?.length || 0;
            const hasAllEvidence = progress.evidenceFound.length === totalRealEvidence;
            const hasPrimarySuspect = progress.primarySuspectConfirmed;

            if (hasAllEvidence && hasPrimarySuspect) {
                progress.caseStatus = 'completed';
            }
        },

        getCurrentMissionContent(): MissionContent | null {
            if (!this.currentMission) return null;
            return this.missionContents[this.currentMission] || null;
        },

        saveEmailState(missionId: string, emailUIStates: Record<string, EmailUIState>, activeFolder: string, selectedEmail: string | null, searchQuery?: string) {
            if (!this.progress[missionId]) return;
            this.progress[missionId].emailUIStates = emailUIStates;
            this.progress[missionId].activeEmailFolder = activeFolder;
            this.progress[missionId].selectedEmail = selectedEmail;
            if (searchQuery !== undefined) {
                this.progress[missionId].emailSearchQuery = searchQuery;
            }
        },

        getEmailState(missionId: string) {
            if (!this.progress[missionId]) return null;
            return {
                emailUIStates: this.progress[missionId].emailUIStates || {},
                activeEmailFolder: this.progress[missionId].activeEmailFolder || 'inbox',
                selectedEmail: this.progress[missionId].selectedEmail || null,
                emailSearchQuery: this.progress[missionId].emailSearchQuery || ''
            };
        },

        saveChatState(missionId: string, chatUIStates: Record<string, ChatUIState>, deletedChats: string[], permanentlyDeletedChats: string[], activeChatId: string | null, chatFilter: string, customChats: Chat[], searchQuery?: string) {
            if (!this.progress[missionId]) return;
            this.progress[missionId].chatUIStates = chatUIStates;
            this.progress[missionId].deletedChats = deletedChats;
            this.progress[missionId].permanentlyDeletedChats = permanentlyDeletedChats;
            this.progress[missionId].activeChatId = activeChatId;
            this.progress[missionId].chatFilter = chatFilter as 'chats' | 'own' | 'all' | 'observed' | 'trash';
            this.progress[missionId].customChats = customChats;
            if (searchQuery !== undefined) {
                this.progress[missionId].chatSearchQuery = searchQuery;
            }
        },

        getChatState(missionId: string) {
            if (!this.progress[missionId]) return null;
            return {
                chatUIStates: this.progress[missionId].chatUIStates || {},
                deletedChats: this.progress[missionId].deletedChats || [],
                permanentlyDeletedChats: this.progress[missionId].permanentlyDeletedChats || [],
                activeChatId: this.progress[missionId].activeChatId || null,
                chatFilter: this.progress[missionId].chatFilter || 'chats',
                customChats: this.progress[missionId].customChats || [],
                chatSearchQuery: this.progress[missionId].chatSearchQuery || ''
            };
        }
    },

    getters: {
        currentProgress(): MissionProgress | null {
            if (!this.currentMission || !this.progress[this.currentMission]) {
                return null;
            }
            return this.progress[this.currentMission] || null;
        },

        currentMissionData(): Mission | null {
            if (!this.currentMission) return null;
            return this.missions.find(s => s.id === this.currentMission) || null;
        },

        currentMissionContent(): MissionContent | null {
            if (!this.currentMission) return null;
            return this.missionContents[this.currentMission] || null;
        },

        availableMissions(): Mission[] {
            const authStore = useAuthStore();

            const filtered = this.missions.filter(mission =>
                mission.available &&
                authStore.canAccessMission(mission)
            );

            return sortMissions(filtered, 'clearance');
        },

        getAvailableMissionsSorted: (state) => (sortBy: 'clearance' | 'difficulty' | 'alphabetical' = 'clearance') => {
            return sortMissions(state.missions, sortBy);
        },

        agent() {
            const authStore = useAuthStore();
            return authStore.userAgent || {
                badge: "GUEST",
                name: "Guest User",
                rank: "Visitor",
                department: "Public Access",
                clearanceLevel: 0,
                joinDate: new Date()
            };
        }
    }
});