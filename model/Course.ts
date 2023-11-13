import Schedule from "./Schedule";

class Course {
  subject: string;
  cid: number;
  crn: number;
  title: string;
  instructor: string;
  section: string;
  credits: number;
  description: string;
  maxEnrollment: number;
  currentEnrollment: number;
  times: Schedule[];

  constructor(
    subject: string,
    cid: number,
    crn: number,
    title: string,
    description: string,
    instructor: string,
    section: string,
    credits: number,
    maxEnrollment: number,
    currentEnrollment: number,
    times: Schedule[]
  ) {
    this.subject = subject;
    this.cid = cid;
    this.crn = crn;
    this.title = title;
    this.description = description;
    this.instructor = instructor;
    this.section = section;
    this.credits = credits;
    this.times = times;
    this.maxEnrollment = maxEnrollment;
    this.currentEnrollment = currentEnrollment;
  }
}

export default Course;
