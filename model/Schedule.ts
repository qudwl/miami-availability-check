class Schedule {
  start: string;
  end: string;
  day: string;
  buildingName: string;
  buildingCode: string;
  constructor(
    start: string,
    end: string,
    day: string,
    buildingName: string = "",
    buildingCode: string = ""
  ) {
    this.start = start;
    this.end = end;
    this.day = day;
    this.buildingName = buildingName;
    this.buildingCode = buildingCode;
  }
}

export default Schedule;
