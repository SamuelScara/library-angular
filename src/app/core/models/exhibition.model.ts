export interface Exhibition {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  simulationDate: Date;
  libId: number;
  bookIds: number[];
}
