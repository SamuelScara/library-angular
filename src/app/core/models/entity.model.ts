export type EntityType = 'AUTHOR' | 'DIRECTOR' | 'NONE';

export interface LinkEntityResult {
  authorId: number | null;
  directorId: number | null;
}
