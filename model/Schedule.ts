import Time from "./Time";

class Schedule {
  start: Time;
  end: Time;
  day: number;
  constructor(start: Time, end: Time, day: number) {
    this.start = start;
    this.end = end;
    this.day = day;
  }
}

export default Schedule;
