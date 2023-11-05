import Time from "./Time";

class Schedule {
  start: Time;
  end: Time;
  day: number;
  buildingName: string;
  buildingCode: string;
  constructor(
    start: Time,
    end: Time,
    day: number,
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
