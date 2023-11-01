class TermInfo {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;

  constructor(id: string, label: string, startDate: string, endDate: string) {
    this.id = id;
    this.label = label;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}

export default TermInfo;
