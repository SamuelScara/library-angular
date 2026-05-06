import { SimulationEntry } from './simulation-entry.model';

export interface SimulationResponse {
  id: number;
  exhibition: string;
  library: string;
  simulationDate: string;
  ranking: SimulationEntry[];
}
