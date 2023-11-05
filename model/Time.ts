class Time {
  _hour: number;
  _minute: number;
  get time(): string {
    let hour = this._hour.toString();
    let minute = this._minute.toString();
    if (hour.length == 1) {
      hour = "0" + hour;
    }
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    return hour + ":" + minute;
  }
  constructor(hour: number, minute: number) {
    this._hour = hour;
    this._minute = minute;
  }
}

export default Time;
