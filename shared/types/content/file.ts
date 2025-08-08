export interface FileDocument extends BaseEntity {
    id: string;
    name: string;
    type: 'document' | 'spreadsheet' | 'image' | 'video' | 'audio' | 'archive';
    size: string;
    lastModified: Date;
    author: string;
    content: string;
}