export interface Email extends BaseEntity {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  cc?: string[]; // default: []
  folder?: 'inbox' | 'sent' | 'drafts' | 'trash' | 'important'; // default: 'inbox'
  attachments?: string[]; // default: []
}

export interface EmailFolder {
  id: string;
  name: string;
  icon: string;
}