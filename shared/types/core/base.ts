export interface BaseEntity {
  id: string;
  createdAt?: Date; // default: null
  updatedAt?: Date; // default: null
}

export interface Timestamps {
  createdAt: Date;
  updatedAt?: Date; // default: createdAt
}

export type DifficultyLevel = 'Rookie' | 'Agent' | 'Senior Agent' | 'Special Agent' | 'Supervisor' | 'Section Chief' | 'Deputy Director' | 'Director';

export type SecurityClearanceLevel = 1 | 2 | 3 | 4 | 5 | 6;