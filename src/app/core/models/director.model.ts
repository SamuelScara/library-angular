import { Lib } from './lib.model';

export interface Director {
  id: number;
  libId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  lib?: Lib | null;
}
