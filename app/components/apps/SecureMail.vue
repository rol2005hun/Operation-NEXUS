<template>
  <div class="app-secure-mail">

    <div class="email-sidebar">
      <div class="compose-section">
        <button class="compose-btn" @click="openCompose">✏️ Compose</button>
      </div>
      <div class="folders">
        <div v-for="folder in folders" :key="folder.id" class="folder" :class="{ active: activeFolder === folder.id }"
          @click="activeFolder = folder.id">
          <span class="folder-icon">{{ folder.icon }}</span>
          <span class="folder-name">{{ folder.name }}</span>
          <span v-if="getFolderUnreadCount(folder.id) > 0" class="unread-count">{{ getFolderUnreadCount(folder.id)
          }}</span>
        </div>
      </div>
    </div>

    <div class="email-list">
      <div class="email-header">
        <div class="header-top">
          <div class="header-info">
            <h3>{{ getCurrentFolder()?.name || 'Inbox' }}</h3>
            <span class="email-count">({{ getUnreadCount() }}/{{ currentEmails.length }})</span>
          </div>
          <button class="refresh-btn" @click="refreshEmails">↻</button>
        </div>
        <div class="header-bottom">
          <div class="search-container">
            <input v-model="searchQuery" type="text" placeholder="Search emails..." class="search-input"
              @input="onSearchInput">
            <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">✕</button>
          </div>
        </div>
      </div>

      <div class="emails-container">
        <div v-for="email in currentEmails" :key="email.id" class="email-item" :class="{
          selected: selectedEmail === email.id,
          unread: !isEmailRead(email.id),
          important: isEmailImportant(email.id)
        }" @click="selectEmail(email.id)">
          <div class="email-sender">{{ displaySender(email) }}</div>
          <div class="email-subject">{{ email.subject }}</div>
          <div class="email-preview">{{ getEmailPreview(email) }}</div>
          <div class="email-time">{{ formatTime(email.timestamp) }}</div>
          <div v-if="hasAttachment(email)" class="attachment-indicator">📎</div>
          <div class="email-item-actions">
            <button v-if="activeFolder !== 'trash'" class="action-btn trash" @click.stop="moveToTrash(email.id)"
              title="Move to Trash">🗑️</button>
            <button v-if="activeFolder === 'trash'" class="action-btn restore" @click.stop="restoreFromTrash(email.id)"
              title="Restore">↶</button>
            <button v-if="activeFolder === 'trash'" class="action-btn delete" @click.stop="permanentDelete(email.id)"
              title="Delete Forever">❌</button>
            <button class="action-btn important" @click.stop="toggleImportant(email.id)"
              :class="{ active: isEmailImportant(email.id) }" title="Toggle Important">⭐</button>
          </div>
        </div>

        <div v-if="currentEmails.length === 0" class="no-emails">
          <p>No emails in this folder</p>
        </div>
      </div>
    </div>

    <div class="email-content">
      <div v-if="selectedEmailData" class="email-view">
        <div class="email-headers">
          <div class="header-main">
            <h2 :title="selectedEmailData?.subject">{{ selectedEmailData?.subject }}</h2>
            <button v-if="selectedEmailData" class="mark-evidence-btn"
              :class="{ 'marked': isMarkedAsEvidence(selectedEmailData.id) }"
              @click="toggleEvidence(selectedEmailData.id)">
              {{ isMarkedAsEvidence(selectedEmailData.id) ? '🔍 Evidence' : '🔍 Mark as Evidence' }}
            </button>
          </div>
          <div v-if="selectedEmailData" class="email-meta">
            <div><strong>From:</strong> {{ displayEmailAddress(selectedEmailData.from) }}</div>
            <div><strong>To:</strong> {{ displayRecipients(selectedEmailData) }}</div>
            <div><strong>Date:</strong> {{ formatDate(selectedEmailData.timestamp) }}</div>
          </div>
        </div>

        <div v-if="selectedEmailData" class="email-body" v-html="getEmailContent(selectedEmailData)"></div>

        <div v-if="selectedEmailData?.attachments?.length" class="email-attachments">
          <h4>Attachments:</h4>
          <div v-for="file in useAttachment().getAttachments(selectedEmailData.attachments)" :key="file.id"
            class="attachment" @click="openFileAttachment(file)" :class="{ 'clickable': true }">
            <span class="attachment-icon">📄</span>
            <span class="attachment-name" :title="file.name">{{ file.name }}</span>
            <span class="attachment-size">{{ file.size }}</span>
            <span class="open-hint">Click to open</span>
          </div>
        </div>
      </div>

      <div v-else class="no-email-selected">
        <p>Select an email to read</p>
      </div>
    </div>

    <div v-if="showCompose" class="compose-modal">
      <div class="compose-content">
        <div class="compose-header">
          <h3>Compose Email</h3>
          <button class="close-btn" @click="closeCompose">✕</button>
        </div>
        <form @submit.prevent="sendEmail" class="compose-form">
          <div class="form-row">
            <label>To:</label>
            <input v-model="composeForm.to" type="email" required :placeholder="`recipient@${emailDomain}`">
          </div>
          <div class="form-row">
            <label>CC:</label>
            <input v-model="composeForm.cc" type="email" :placeholder="`cc@${emailDomain}`">
          </div>
          <div class="form-row">
            <label>Subject:</label>
            <input v-model="composeForm.subject" type="text" required placeholder="Email subject">
          </div>
          <div class="form-row">
            <label>Message:</label>
            <textarea v-model="composeForm.body" required placeholder="Type your message here..." rows="10"></textarea>
          </div>
          <div class="compose-actions">
            <button type="button" class="cancel-btn" @click="closeCompose">Cancel</button>
            <button type="submit" class="send-btn">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const gameStore = useGameStore();

const activeFolder = ref('inbox');
const selectedEmail = ref<string | null>(null);
const showCompose = ref(false);
const searchQuery = ref('');
const currentMissionContent = ref<MissionContent | null>(null);
const composeForm = ref({
  to: '',
  cc: '',
  subject: '',
  body: ''
});

const folders: EmailFolder[] = [
  { id: 'inbox', name: 'Inbox', icon: '📥' },
  { id: 'sent', name: 'Sent', icon: '📤' },
  { id: 'mission', name: 'Mission Access', icon: '🔐' },
  { id: 'drafts', name: 'Drafts', icon: '📝' },
  { id: 'important', name: 'Important', icon: '⭐' },
  { id: 'allmails', name: 'All Mails', icon: '📧' },
  { id: 'trash', name: 'Trash', icon: '🗑️' }
];

const playerEmail = computed(() => {
  if (!authStore.currentUser) return '';
  const domain = currentMissionContent.value?.setting?.playerEmailDomain;
  return `${authStore.currentUser.username}@${domain}`;
});

const emailDomain = computed(() => {
  return currentMissionContent.value?.setting?.playerEmailDomain;
});

const currentUsername = computed(() => {
  return authStore.currentUser?.username || 'agent';
});

const getMissionEmails = (): Email[] => {
  return currentMissionContent.value?.emails || [];
}

const processEmailContent = (content: string): string => {
  return content.replace(/{username}/g, currentUsername.value);
};

const processEmailAddress = (address: string): string => {
  return address.replace(/{username}/g, currentUsername.value);
};

const emails = ref<Email[]>([]);
const emailUIState = ref<Record<string, { read: boolean; important: boolean; folder: string }>>({});

const saveEmailState = () => {
  if (gameStore.currentMission) {
    gameStore.saveEmailState(
      gameStore.currentMission,
      emailUIState.value,
      activeFolder.value,
      selectedEmail.value,
      searchQuery.value
    );
  }
};

const initializeEmails = () => {
  const missionEmails = getMissionEmails();
  emails.value = missionEmails.map(email => ({
    ...email,
    from: processEmailAddress(email.from),
    to: processEmailAddress(email.to),
    subject: processEmailContent(email.subject),
    body: processEmailContent(email.body)
  }));

  const savedState = gameStore.getEmailState(gameStore.currentMission!);
  if (savedState) {
    emailUIState.value = { ...savedState.emailUIStates };
    activeFolder.value = savedState.activeEmailFolder;
    selectedEmail.value = savedState.selectedEmail;
    searchQuery.value = savedState.emailSearchQuery;
  }

  emails.value.forEach(email => {
    if (!emailUIState.value[email.id]) {
      const playerEmailValue = playerEmail.value;
      let folder = 'mission';

      if (email.to === playerEmailValue ||
        email.to.includes(currentUsername.value)) {
        folder = 'inbox';
      }

      if (email.from === playerEmailValue ||
        email.from.includes(`${currentUsername.value}@`)) {
        folder = 'sent';
      }

      emailUIState.value[email.id] = {
        read: false,
        important: false,
        folder: folder
      };
    }
  });

  saveEmailState();
};

function getFolderUnreadCount(folderId: string): number {
  if (folderId === 'important') {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      return uiState && uiState.important && !uiState.read && uiState.folder !== 'trash';
    }).length;
  } else if (folderId === 'allmails') {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      return uiState && !uiState.read;
    }).length;
  } else if (folderId === 'sent') {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.read || uiState.folder === 'trash') return false;
      return email.from === playerEmail.value ||
        email.from.includes(`${currentUsername.value}@`) ||
        email.from.includes(currentUsername.value);
    }).length;
  } else if (folderId === 'mission') {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.read || uiState.folder === 'trash') return false;

      const playerEmailValue = playerEmail.value;
      const isFromPlayer = email.from === playerEmailValue ||
        email.from.includes(`${currentUsername.value}@`);
      const isToPlayer = email.to === playerEmailValue ||
        email.to.includes(currentUsername.value);

      return !isFromPlayer && !isToPlayer;
    }).length;
  } else if (folderId === 'inbox') {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.read || uiState.folder === 'trash') return false;

      return email.to === playerEmail.value ||
        email.to.includes(currentUsername.value);
    }).length;
  } else {
    return emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      return uiState && uiState.folder === folderId && !uiState.read;
    }).length;
  }
}

const getCurrentFolder = () => {
  return folders.find(f => f.id === activeFolder.value);
};

const getUnreadCount = () => {
  return currentEmails.value.filter(email => {
    const uiState = emailUIState.value[email.id];
    return uiState && !uiState.read;
  }).length;
};

const currentEmails = computed(() => {
  let filteredEmails: Email[] = [];

  if (activeFolder.value === 'important') {
    filteredEmails = emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      return uiState && uiState.important && uiState.folder !== 'trash';
    });
  } else if (activeFolder.value === 'allmails') {
    filteredEmails = emails.value;
  } else if (activeFolder.value === 'sent') {
    filteredEmails = emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.folder === 'trash') return false;
      if (uiState.folder === 'sent') return true;

      return email.from === playerEmail.value ||
        email.from.includes(`${currentUsername.value}@`) ||
        email.from.includes(currentUsername.value);
    });
  } else if (activeFolder.value === 'mission') {
    filteredEmails = emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.folder === 'trash') return false;

      const playerEmailValue = playerEmail.value;
      const isFromPlayer = email.from === playerEmailValue ||
        email.from.includes(`${currentUsername.value}@`);
      const isToPlayer = email.to === playerEmailValue ||
        email.to.includes(currentUsername.value);

      return !isFromPlayer && !isToPlayer;
    });
  } else if (activeFolder.value === 'inbox') {
    filteredEmails = emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      if (!uiState || uiState.folder === 'trash') return false;

      return email.to === playerEmail.value ||
        email.to.includes(currentUsername.value);
    });
  } else {
    filteredEmails = emails.value.filter(email => {
      const uiState = emailUIState.value[email.id];
      return uiState && uiState.folder === activeFolder.value;
    });
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filteredEmails = filteredEmails.filter(email => {
      const searchableContent = [
        email.subject,
        email.body,
        email.from,
        email.to,
        ...(email.cc || [])
      ].join(' ').toLowerCase();

      const attachmentNames = email.attachments?.map(attachmentId => {
        const file = useAttachment().getAttachments([attachmentId])[0];
        return file?.name || '';
      }).join(' ').toLowerCase() || '';

      return searchableContent.includes(query) || attachmentNames.includes(query);
    });
  }

  return filteredEmails.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA;
  });
});

const selectedEmailData = computed(() => {
  if (!selectedEmail.value) return null;
  return emails.value.find(email => email.id === selectedEmail.value);
});

const selectEmail = (emailId: string) => {
  selectedEmail.value = emailId;
  const email = emails.value.find(e => e.id === emailId);
  const uiState = emailUIState.value[emailId];

  if (email && uiState && !uiState.read) {
    uiState.read = true;
    if (gameStore.currentMissionData) {
      gameStore.markEmailRead(gameStore.currentMissionData.id, emailId);
    }
  }
  saveEmailState();
};

const refreshEmails = () => {
  initializeEmails();
};

const onSearchInput = () => {
  saveEmailState();
};

const clearSearch = () => {
  searchQuery.value = '';
  saveEmailState();
};

const moveToTrash = (emailId: string) => {
  const uiState = emailUIState.value[emailId];
  if (uiState) {
    uiState.folder = 'trash';
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
    saveEmailState();
  }
};

const toggleImportant = (emailId: string) => {
  const uiState = emailUIState.value[emailId];
  if (uiState) {
    uiState.important = !uiState.important;
    saveEmailState();
  }
};

const restoreFromTrash = (emailId: string) => {
  const uiState = emailUIState.value[emailId];
  if (uiState) {
    uiState.folder = 'inbox';
    saveEmailState();
  }
};

const permanentDelete = (emailId: string) => {
  const index = emails.value.findIndex(e => e.id === emailId);
  if (index !== -1) {
    emails.value.splice(index, 1);
    delete emailUIState.value[emailId];
    if (selectedEmail.value === emailId) {
      selectedEmail.value = null;
    }
    saveEmailState();
  }
};

const isMarkedAsEvidence = (emailId: string) => {
  if (!gameStore.currentMissionData || !gameStore.currentProgress) return false;
  return gameStore.currentProgress.markedEvidence.includes(emailId);
};

const toggleEvidence = (emailId: string) => {
  if (!gameStore.currentMissionData) return;

  gameStore.toggleEvidence(gameStore.currentMissionData.id, emailId);
};

const openCompose = () => {
  showCompose.value = true;
  composeForm.value = {
    to: '',
    cc: '',
    subject: '',
    body: ''
  };
};

const closeCompose = () => {
  showCompose.value = false;
};

const sendEmail = () => {
  const newEmail: Email = {
    id: `email_${Date.now()}`,
    from: playerEmail.value,
    to: composeForm.value.to,
    cc: composeForm.value.cc ? [composeForm.value.cc] : undefined,
    subject: composeForm.value.subject,
    body: composeForm.value.body,
    timestamp: new Date(),
    folder: 'sent',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  emails.value.push(newEmail);

  emailUIState.value[newEmail.id] = {
    read: true,
    important: false,
    folder: 'sent'
  };

  showCompose.value = false;
};

const getEmailUIState = (emailId: string) => {
  return emailUIState.value[emailId] || { read: false, important: false, folder: 'inbox' };
};

const isEmailRead = (emailId: string) => {
  return getEmailUIState(emailId).read;
};

const isEmailImportant = (emailId: string) => {
  return getEmailUIState(emailId).important;
};

const hasAttachment = (email: Email) => {
  return (email.attachments?.length || 0) > 0;
};

const getEmailPreview = (email: Email) => {
  return email.body.length > 100 ? email.body.substring(0, 100) + '...' : email.body;
};

const getEmailContent = (email: Email) => {
  return formatEmailContent(email.body);
};

const formatEmailContent = (content: string): string => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<em>$1</em>');
};

function displayEmailAddress(address: string): string {
  const processedAddress = processEmailAddress(address);

  return processedAddress;
}

function displayRecipients(email: Email): string {
  const recipients: string[] = [];

  if (email.to) {
    recipients.push(displayEmailAddress(email.to));
  }

  if (email.cc && email.cc.length > 0) {
    recipients.push(...email.cc.map(recipient => `${displayEmailAddress(recipient)} (CC)`));
  }

  return recipients.length > 0 ? recipients.join(', ') : displayEmailAddress(email.to || '');
}

function displaySender(email: Email): string {
  return displayEmailAddress(email.from);
}

const openFileAttachment = async (file: FileDocument) => {
  const laptopStore = useLaptopStore();
  laptopStore.openFileInReader(file.id);
};

onMounted(async () => {
  currentMissionContent.value = await gameStore.getCurrentMissionContent();
  initializeEmails();
});

onUnmounted(() => {
  saveEmailState();
});

watch(() => gameStore.currentMissionData, async (newMission) => {
  if (newMission) {
    currentMissionContent.value = await gameStore.getCurrentMissionContent();
    selectedEmail.value = null;
    activeFolder.value = 'inbox';
    initializeEmails();
  }
});

watch(activeFolder, () => {
  saveEmailState();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/SecureMail';
</style>