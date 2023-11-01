import Time from "../model/Time";
import Schedule from "../model/Schedule";
import Course from "../model/Course";
import TermInfo from "../model/TermInfo";

const url = "https://ws.apps.miamioh.edu/api/"; // API URL
const termAPI = "academicTerm/v2?numOfFutureTerms=2&numOfPastTerms=2"; // API to get Terms
const curCourses =
  "courseSection/v3/courseSection?campusCode=O&limit=20&termCode="; // API to get Courses
const composeObjects =
  "&compose=%2Cschedules%2Cinstructors%2Cattributes%2CcrossListedCourseSections%2CenrollmentDistribution";

/**
 * Get the department data.
 * @param term
 * @param dept
 * @param offset
 * @returns
 */
const getDeptData = async (
  term: string,
  dept: string,
  offset = 0
): Promise<[boolean, Course[]]> => {
  const courses: Course[] = new Array<Course>();
  // Get the course data from the API
  const apiURL =
    url +
    curCourses +
    term +
    (offset === 0 ? "" : "&offset=" + (offset * 20 + 1)) +
    composeObjects +
    "&course_subjectCode=" +
    dept;
  const courseData = await fetch(apiURL);
  // Convert to JSON
  const courseJson = await courseData.json();
  for (let course of courseJson.data) {
    let formatted = formatCourse(course);
    if (formatted != null) {
      courses.push(formatted);
    }
  }
  return [courseJson.data.length == 20, courses];
};

/**
 * Format the course data into a Course object
 * @param course
 * @returns a Course object.
 */
const formatCourse = (course: {
  isDisplayed: any;
  instructors: any;
  schedules: { days: string | null; startTime: string; endTime: string }[];
  course: { subjectCode: any; number: any; title: any; creditHoursHigh: any };
  crn: any;
  courseSectionCode: any;
}): Course | null => {
  // Check if the course is displayed
  if (!course.isDisplayed) {
    return null;
  }

  // Get the primary instructor
  let instructor = "";
  for (let prof of course.instructors) {
    if (prof.isPrimary) {
      instructor = prof.person.informalDisplayedName;
      break;
    }
  }

  // Convert the times to Schedule objects
  const times: Schedule[] = new Array<Schedule>();
  course.schedules.forEach(
    (time: { days: string | null; startTime: string; endTime: string }) => {
      if (time.days == null) {
        return;
      }
      const startTime: Time = stringToTime(time.startTime);
      const endTime: Time = stringToTime(time.endTime);
      for (let day of time.days.split("")) {
        const timeObj = new Schedule(startTime, endTime, getDay(day));
        times.push(timeObj);
      }
    }
  );

  // Create the Course object
  const courseData = new Course(
    course.course.subjectCode,
    course.course.number,
    course.crn,
    course.course.title,
    instructor,
    course.courseSectionCode,
    course.course.creditHoursHigh,
    times
  );
  return courseData;
};

/**
 * Convert a day string to a number
 * @param day
 * @returns number representing 0-4 for M-F
 */
const getDay = (day: string): number => {
  switch (day) {
    case "M":
      return 0;
    case "T":
      return 1;
    case "W":
      return 2;
    case "R":
      return 3;
    case "F":
      return 4;
    default:
      console.log("Error! Not a day:", day);
      return -1;
  }
};

/**
 * Convert a string to a Time object
 * Format: HH:MM
 * @param time
 * @returns Time object.
 */
const stringToTime = (time: string): Time => {
  const split = time.split(":");
  return new Time(parseInt(split[0]), parseInt(split[1]));
};

const getTerm = async (): Promise<TermInfo[]> => {
  const termData = await fetch(url + termAPI);
  const termJson = await termData.json();

  const terms: TermInfo[] = new Array<TermInfo>();
  for (let term of termJson.data) {
    if (term.displayTerm) {
      terms.push(
        new TermInfo(term.termId, term.name, term.startDate, term.endDate)
      );
    }
  }

  return terms;
};

export { getDeptData, getTerm };
