class TermInfo {
  id: number;
  label: string;
  startDate: Date;
  endDate: Date;

  constructor(id: number, label: string, startDate: string, endDate: string) {
    this.id = id;
    this.label = label;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}

export default TermInfo;
