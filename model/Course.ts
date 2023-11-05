import Schedule from "./Schedule";

class Course {
  subject: string;
  cid: number;
  crn: number;
  title: string;
  instructors: string;
  section: string;
  credits: number;
  description: string;
  times: Schedule[];

  constructor(
    subject: string,
    cid: number,
    crn: number,
    title: string,
    description: string,
    instructors: string,
    section: string,
    credits: number,
    times: Schedule[]
  ) {
    this.subject = subject;
    this.cid = cid;
    this.crn = crn;
    this.title = title;
    this.description = description;
    this.instructors = instructors;
    this.section = section;
    this.credits = credits;
    this.times = times;
  }
}

export default Course;
