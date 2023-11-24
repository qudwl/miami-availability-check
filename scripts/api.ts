import Schedule from "../model/Schedule";
import Course from "../model/Course";
import TermInfo from "../model/TermInfo";

const url = "https://ws.apps.miamioh.edu/api/"; // API URL
const termAPI = "academicTerm/v2?numOfFutureTerms=2&numOfPastTerms=2"; // API to get Terms
const curCourses = "courseSection/v3/courseSection?limit=20&termCode="; // API to get Courses
const crnCourses = "courseSection/v3/courseSection?crn="; // API to get Courses from CRN
const composeObjects =
  "&compose=%2Cschedules%2Cinstructors%2Cattributes%2CcrossListedCourseSections%2CenrollmentCount";

import { getItem } from "../storage/preferences";

/**
 * Get the department data.
 * @param term
 * @param dept
 * @param offset
 * @returns
 */
const getDeptData = async (
  term: number,
  dept: string,
  offset = 0
): Promise<[boolean, Course[]]> => {
  const courses: Course[] = new Array<Course>();
  const campus = await getItem("campus");
  // Get the course data from the API
  const apiURL =
    url +
    curCourses +
    term +
    (offset === 0 ? "" : "&offset=" + (offset * 20 + 1)) +
    composeObjects +
    "&course_subjectCode=" +
    dept +
    "&campusCode=" +
    campus;
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

const getCourseFromCRN = async (
  term: number,
  crns: string[]
): Promise<Course[]> => {
  const apiURL =
    url + crnCourses + crns.join("%2C") + "&termCode=" + term + composeObjects;
  const courseData = await fetch(apiURL);
  const courseJson = await courseData.json();
  const course = courseJson.data;
  const result = course.map((course: any) => {
    return formatCourse(course);
  });
  if (result == null) {
    throw new Error("Course not found!");
  }
  return result;
};

/**
 * Format the course data into a Course object
 * @param course
 * @returns a Course object.
 */
const formatCourse = (course: {
  isDisplayed: boolean;
  instructors: any;
  schedules: {
    days: string | null;
    startTime: string;
    endTime: string;
    buildingName: string;
    buildingCode: string;
    scheduleTypeCode: string;
  }[];
  course: {
    subjectCode: any;
    number: any;
    description: string;
    title: any;
    creditHoursHigh: any;
  };
  enrollmentCount: {
    numberOfMax: number;
    numberOfCurrent: number;
  };
  crn: string;
  courseSectionCode: string;
  courseSectionStatusCode: string;
}): Course | null => {
  // Check if the course is displayed
  if (!course.isDisplayed) {
    return null;
  }

  // Check if the course is active
  if (course.courseSectionStatusCode != "A") {
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
    (time: {
      days: string | null;
      startTime: string;
      endTime: string;
      buildingName: string;
      buildingCode: string;
      scheduleTypeCode: string;
    }) => {
      if (time.days == null) {
        return;
      }
      if (time.scheduleTypeCode == "FEXM") {
        return;
      }
      const timeObj = new Schedule(
        time.startTime,
        time.endTime,
        time.days,
        time.buildingName,
        time.buildingCode
      );
      times.push(timeObj);
    }
  );

  // Create the Course object
  const courseData = new Course(
    course.course.subjectCode,
    course.course.number,
    parseInt(course.crn),
    course.course.title,
    course.course.description,
    instructor,
    course.courseSectionCode,
    course.course.creditHoursHigh,
    course.enrollmentCount.numberOfMax,
    course.enrollmentCount.numberOfCurrent,
    times
  );
  return courseData;
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

const saveScheduleToWeb = async (schedules: Course[], name: string) => {
  const apiURL =
    "https://etbd.tech/limb2_115461/wdata/putjson.php?file=" + name + ".json";

  const term = await getItem("currentTerm");
  const campus = await getItem("campus");

  const data = {
    name: name,
    schedules: schedules,
    term: term,
    campus: campus,
  };

  await fetch(apiURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    mode: "no-cors",
    cache: "no-cache",
  });

  console.log("Success?");

  return true;
};

const loadScheduleFromWeb = async (name: string) => {
  const apiURL =
    "https://etbd.tech/limb2_115461/wdata/getjson.php?file=" + name + ".json";

  const data = await fetch(apiURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    mode: "no-cors",
    cache: "no-cache",
  });

  const json = await data.json();

  return json;
};

export {
  getDeptData,
  getTerm,
  getCourseFromCRN,
  saveScheduleToWeb,
  loadScheduleFromWeb,
};
