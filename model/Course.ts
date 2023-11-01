import Schedule from "./Schedule";

class Course {
  subject: string;
  cid: number;
  crn: string;
  title: string;
  instructors: string;
  section: string;
  credits: number;
  times: Schedule[];

  constructor(
    subject: string,
    cid: number,
    crn: string,
    title: string,
    instructors: string,
    section: string,
    credits: number,
    times: Schedule[]
  ) {
    this.subject = subject;
    this.cid = cid;
    this.crn = crn;
    this.title = title;
    this.instructors = instructors;
    this.section = section;
    this.credits = credits;
    this.times = times;
  }
}

export default Course;
