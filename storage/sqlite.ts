import * as SQLite from "expo-sqlite";
import Course from "../model/Course";
import Schedule from "../model/Schedule";

const coursesDB = SQLite.openDatabase("courses.db");

const init = async () => {
  coursesDB.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS courses (
      crn INTEGER PRIMARY KEY NOT NULL, 
      title TEXT NOT NULL, 
      subject TEXT NOT NULL, 
      description TEXT NOT NULL,
      cid INTEGER NOT NULL,
      section TEXT NOT NULL,
      credits INTEGER NOT NULL);`);
  });
  coursesDB.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS schedules (
      crn INTEGER PRIMARY KEY NOT NULL,
      start INTEGER NOT NULL,
      end INTEGER NOT NULL,
      day INTEGER NOT NULL,
      buildingName TEXT NOT NULL,
      buildingCode TEXT NOT NULL);`);
  });
};

const insertCourse = (course: Course) => {
  coursesDB.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO courses (crn, title, subject, description, cid, section, credits) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        course.crn,
        course.title,
        course.subject,
        course.description,
        course.cid,
        course.section,
        course.credits,
      ]
    );
  });
  for (let schedule of course.times) {
    coursesDB.execAsync(
      [
        {
          sql: `INSERT INTO schedules (crn, start, end, day, buildingName, buildingCode) VALUES (?, ?, ?, ?, ?, ?);`,
          args: [
            course.crn,
            schedule.start,
            schedule.end,
            schedule.day,
            schedule.buildingName,
            schedule.buildingCode,
          ],
        },
      ],
      false
    );
  }
};

const getDBClasses = async () => {
  const coursesList = await coursesDB.execAsync(
    [
      {
        sql: `SELECT * FROM courses;`,
        args: [],
      },
    ],
    true
  );

  const courses = coursesList[0].rows;

  const schedulesList = await coursesDB.execAsync(
    [
      {
        sql: `SELECT * FROM schedules;`,
        args: [],
      },
    ],
    true
  );

  const schedules = schedulesList[0].rows;

  courses.forEach((course: any) => {
    course.times = [];
    schedules.forEach((schedule: any) => {
      if (course.crn === schedule.crn) {
        course.times.push(
          new Schedule(
            schedule.start,
            schedule.end,
            schedule.day,
            schedule.buildingName,
            schedule.buildingCode
          )
        );
      }
    });
  });

  console.log(courses);
  return courses;
};

const getSavedCourses = async () => {
  const results = await coursesDB.execAsync(
    [{ sql: `SELECT * FROM courses;`, args: [] }],
    true
  );

  const arr = results[0].rows;
  return arr;
};

const deleteCourse = (crn: number) => {
  coursesDB.transaction((tx) => {
    tx.executeSql(`DELETE FROM courses WHERE crn = ?;`, [crn]);
  });
};

const deleteAll = () => {
  coursesDB.transaction((tx) => {
    tx.executeSql(`DELETE FROM courses;`);
  });
  coursesDB.transaction((tx) => {
    tx.executeSql(`DELETE FROM schedules;`);
  });
};

const seeIfCourseIsSaved = async (crn: number) => {
  const course = await coursesDB.execAsync(
    [{ sql: `SELECT * FROM courses WHERE crn = ?;`, args: [crn] }],
    true
  );

  return course[0].rows.length > 0;
};

export {
  init,
  insertCourse,
  getSavedCourses,
  deleteCourse,
  deleteAll,
  getDBClasses,
  seeIfCourseIsSaved,
};
