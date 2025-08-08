export const useAttachment = () => {
  const gameStore = useGameStore();

  const getAttachments = (attachmentIds?: string[]): FileDocument[] => {
    if (!attachmentIds || attachmentIds.length === 0) {
      return [];
    }

    const currentMission = gameStore.currentMissionContent;
    if (!currentMission?.files) {
      return [];
    }

    return attachmentIds
      .map(id => currentMission.files.find(file => file.id === id))
      .filter((file): file is FileDocument => file !== undefined);
  };

  return {
    getAttachments
  };
};
