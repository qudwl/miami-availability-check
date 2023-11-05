import * as SQLite from "expo-sqlite";

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
};

const insertCourse = (course: any) => {
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
};

const getCRNs = async () => {
  const results = await coursesDB.execAsync(
    [
      {
        sql: `SELECT crn, subject, cid, section, title FROM courses;`,
        args: [],
      },
    ],
    false
  );

  const arr = results[0].rows;
  return arr;
};

const getSavedCourses = async () => {
  const results = await coursesDB.execAsync(
    [{ sql: `SELECT * FROM courses;`, args: [] }],
    true
  );

  const arr = results[0].rows;
  return arr;
};

export { init, insertCourse, getCRNs, getSavedCourses };
