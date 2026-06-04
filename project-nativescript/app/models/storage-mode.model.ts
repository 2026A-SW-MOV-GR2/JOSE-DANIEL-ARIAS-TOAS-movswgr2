export type StorageMode = 'SQL' | 'NOSQL';

export const STORAGE_MODES: StorageMode[] = ['SQL', 'NOSQL'];

export const STORAGE_LABELS: Record<StorageMode, string> = {
    SQL: 'SQLite',
    NOSQL: 'NoSQL',
};

export const STORAGE_COLORS: Record<StorageMode, string> = {
    SQL: '#4CAF50', // Verde para SQL
    NOSQL: '#2196F3', // Azul para NoSQL
};
