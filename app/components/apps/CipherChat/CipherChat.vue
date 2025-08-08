<template>
  <div class="app-cipher-chat">
    <ChatList :chats="filteredChats" :active-chat="activeChat" :chat-filter="chatFilter" :player-name="playerName"
      :search-query="searchQuery" @select-chat="selectChat" @refresh="refreshChats" @new-chat="showNewChatDialog = true"
      @move-to-trash="moveToTrash" @restore-from-trash="restoreFromTrash" @permanent-delete="permanentDelete"
      @update:chat-filter="chatFilter = $event" @update:search-query="updateSearchQuery" />

    <MessageArea :chat="activeChatData || null" :player-name="playerName"
      :is-marked-as-evidence="activeChatData ? isMarkedAsEvidence(activeChatData.id) : false"
      @send-message="handleSendMessage" @toggle-evidence="toggleEvidence" />

    <NewChatDialog :show="showNewChatDialog" :available-characters="availableCharacters"
      @close="showNewChatDialog = false" @create="handleCreateChat" />
  </div>
</template>

<script setup lang="ts">
import ChatList from './ChatList.vue';
import MessageArea from './MessageArea.vue';
import NewChatDialog from './NewChatDialog.vue';

const gameStore = useGameStore();
const authStore = useAuthStore();

const activeChat = ref<string | null>(null);
const showNewChatDialog = ref(false);
const chatFilter = ref<'chats' | 'own' | 'all' | 'observed' | 'trash'>('chats');
const searchQuery = ref('');
const currentMissionContent = ref<MissionContent | null>(null);
const customChats = ref<Chat[]>([]);
const deletedChatIds = ref<Set<string>>(new Set());
const permanentlyDeletedChatIds = ref<Set<string>>(new Set());

const saveChatState = () => {
  if (gameStore.currentMission) {
    gameStore.saveChatState(
      gameStore.currentMission,
      {},
      Array.from(deletedChatIds.value),
      Array.from(permanentlyDeletedChatIds.value),
      activeChat.value,
      chatFilter.value,
      customChats.value,
      searchQuery.value
    );
  }
};

const updateSearchQuery = (query: string) => {
  searchQuery.value = query;
  saveChatState();
};

const playerName = computed(() => {
  return authStore.userAgent?.name || 'Agent';
});

const availableCharacters = computed(() => {
  if (!currentMissionContent.value) return [];
  return currentMissionContent.value.characters.filter((char: Character) =>
    !char.name.includes('Unknown') &&
    !char.name.includes('External')
  );
});

const enrichChatData = (chat: Chat): Chat => {
  const firstParticipant = chat.participants[0] || '';
  const character = currentMissionContent.value?.characters.find((char: Character) => char.name === firstParticipant);

  return {
    ...chat,
    name: chat.name || chat.participants.join(', '),
    image: chat.image || character?.avatar || '👤',
    status: chat.status || 'offline'
  };
};

const allChats = computed((): Chat[] => {
  if (!currentMissionContent.value) return [];

  const missionChats = currentMissionContent.value.chats.map(enrichChatData);
  return [...missionChats, ...customChats.value];
});

const filteredChats = computed(() => {
  let chats: Chat[] = [];

  switch (chatFilter.value) {
    case 'chats':
      chats = allChats.value.filter(chat =>
        !deletedChatIds.value.has(chat.id) &&
        !permanentlyDeletedChatIds.value.has(chat.id)
      );
      break;
    case 'own':
      chats = allChats.value.filter(chat =>
        chat.participants.includes(playerName.value) &&
        !deletedChatIds.value.has(chat.id) &&
        !permanentlyDeletedChatIds.value.has(chat.id)
      );
      break;
    case 'observed':
      chats = allChats.value.filter(chat =>
        !chat.participants.includes(playerName.value) &&
        !deletedChatIds.value.has(chat.id) &&
        !permanentlyDeletedChatIds.value.has(chat.id)
      );
      break;
    case 'trash':
      chats = allChats.value.filter(chat =>
        deletedChatIds.value.has(chat.id) &&
        !permanentlyDeletedChatIds.value.has(chat.id)
      );
      break;
    case 'all':
    default:
      chats = allChats.value.filter(chat =>
        !deletedChatIds.value.has(chat.id) &&
        !permanentlyDeletedChatIds.value.has(chat.id)
      );
      break;
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    chats = chats.filter(chat => {
      const chatName = (chat.name || '').toLowerCase();
      const participants = chat.participants.join(' ').toLowerCase();
      const messages = chat.messages.map(msg =>
        `${msg.sender} ${msg.content}`
      ).join(' ').toLowerCase();

      return chatName.includes(query) ||
        participants.includes(query) ||
        messages.includes(query);
    });
  }

  return chats.sort((a, b) => {
    const timeA = getLastMessageTime(a).getTime();
    const timeB = getLastMessageTime(b).getTime();
    return timeB - timeA;
  });
});

const getLastMessageTime = (chat: Chat): Date => {
  if (!chat.messages || chat.messages.length === 0) {
    return new Date(0);
  }

  const lastMessage = chat.messages[chat.messages.length - 1];
  return lastMessage?.timestamp || new Date(0);
};

const activeChatData = computed(() => {
  if (!activeChat.value) return null;
  return allChats.value.find(chat => chat.id === activeChat.value);
});

const selectChat = (chatId: string) => {
  activeChat.value = chatId;
  const chat = allChats.value.find(c => c.id === chatId);

  if (chat && gameStore.currentMission) {
    gameStore.markChatRead(gameStore.currentMission, chatId);
  }
  saveChatState();
};

const handleSendMessage = (message: string) => {
  if (!activeChatData.value || !activeChatData.value.participants.includes(playerName.value)) return;

  const chatMessage: ChatMessage = {
    id: 'msg_' + Date.now(),
    content: message,
    timestamp: new Date(),
    sender: playerName.value,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  activeChatData.value.messages.push(chatMessage);
  saveChatState();
};

const handleCreateChat = (data: { type: 'private' | 'group'; name: string; selectedCharacters: string[] }) => {
  if (data.selectedCharacters.length === 0) return;

  const participants = [playerName.value];
  const characterNames = data.selectedCharacters.map(id => {
    const char = availableCharacters.value.find(c => c.id === id);
    return char?.name || 'Unknown';
  });
  participants.push(...characterNames);

  const newChatId = 'custom_chat_' + Date.now();
  const chatName = data.type === 'group'
    ? (data.name || 'New Group Chat')
    : (characterNames[0] || 'Unknown');

  let chatImage = '👥';

  if (data.type === 'private') {
    const firstCharacterName = characterNames[0] || 'Unknown';
    const character = availableCharacters.value.find(char => char.name === firstCharacterName);
    chatImage = character?.avatar || '👤';
  }

  const newChat: Chat = {
    id: newChatId,
    name: chatName,
    image: chatImage,
    participants,
    status: 'online',
    messages: [],
    createdAt: new Date(),
  };

  customChats.value.push(newChat);
  activeChat.value = newChatId;
  showNewChatDialog.value = false;
  saveChatState();
};

const isMarkedAsEvidence = (chatId: string) => {
  if (!gameStore.currentMission || !gameStore.currentProgress) return false;
  return gameStore.currentProgress.markedEvidence.includes(chatId);
};

const toggleEvidence = (chatId: string) => {
  if (!gameStore.currentMission) return;
  gameStore.toggleEvidence(gameStore.currentMission, chatId);
};

const moveToTrash = (chatId: string) => {
  deletedChatIds.value.add(chatId);
  if (activeChat.value === chatId) {
    activeChat.value = null;
  }
  saveChatState();
};

const restoreFromTrash = (chatId: string) => {
  deletedChatIds.value.delete(chatId);
  saveChatState();
};

const refreshChats = () => {
  deletedChatIds.value.clear();
  permanentlyDeletedChatIds.value.clear();
  activeChat.value = null;
  chatFilter.value = 'chats';
  saveChatState();
};

const permanentDelete = (chatId: string) => {
  const customChatIndex = customChats.value.findIndex(chat => chat.id === chatId);
  if (customChatIndex !== -1) {
    customChats.value.splice(customChatIndex, 1);
  }

  permanentlyDeletedChatIds.value.add(chatId);
  deletedChatIds.value.delete(chatId);

  if (activeChat.value === chatId) {
    activeChat.value = null;
  }
  saveChatState();
};

onMounted(async () => {
  currentMissionContent.value = await gameStore.getCurrentMissionContent();

  if (gameStore.currentMission) {
    const savedState = gameStore.getChatState(gameStore.currentMission);
    if (savedState) {
      deletedChatIds.value = new Set(savedState.deletedChats);
      permanentlyDeletedChatIds.value = new Set(savedState.permanentlyDeletedChats);
      activeChat.value = savedState.activeChatId;
      chatFilter.value = savedState.chatFilter;
      customChats.value = savedState.customChats;
      searchQuery.value = savedState.chatSearchQuery;
    }
  }
});

onUnmounted(() => {
  saveChatState();
});

watch(() => gameStore.currentMission, async (newMissionId) => {
  if (newMissionId) {
    currentMissionContent.value = await gameStore.getCurrentMissionContent();

    const savedState = gameStore.getChatState(newMissionId);
    if (savedState) {
      deletedChatIds.value = new Set(savedState.deletedChats);
      permanentlyDeletedChatIds.value = new Set(savedState.permanentlyDeletedChats);
      activeChat.value = savedState.activeChatId;
      chatFilter.value = savedState.chatFilter;
      customChats.value = savedState.customChats;
      searchQuery.value = savedState.chatSearchQuery;
    } else {
      activeChat.value = null;
      customChats.value = [];
      deletedChatIds.value.clear();
      permanentlyDeletedChatIds.value.clear();
      chatFilter.value = 'chats';
      searchQuery.value = '';
    }
  }
});

watch(chatFilter, () => {
  saveChatState();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/CipherChat/CipherChat.scss';
</style>