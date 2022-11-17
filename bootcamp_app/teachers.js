const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

const cohort_month = process.argv[2];
const cohorts_name = '${cohort_month';
const values = [cohorts_name];
const queryString = `
SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort, count(assistance_requests.*) AS total_assistances
FROM teachers
JOIN assistance_requests ON assistance_requests.teacher_id = teachers.id
JOIN students ON students.id = assistance_requests.student_id
JOIN cohorts ON students.cohort_id = cohorts.id
WHERE cohorts.name = $1
GROUP BY teachers.name, cohorts.name
ORDER BY teachers.name;
`;

pool.query(queryString, values);
//-----------------------------------
// const cohort_month = process.argv[2];

// pool.query(`
// SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort, count(assistance_requests.*) AS total_assistances
// FROM teachers
// JOIN assistance_requests ON assistance_requests.teacher_id = teachers.id
// JOIN students ON students.id = assistance_requests.student_id
// JOIN cohorts ON students.cohort_id = cohorts.id
// WHERE cohorts.name = '${cohort_month || 'JUL02'}'
// GROUP BY teachers.name, cohorts.name
// ORDER BY teachers.name;
// `).then(res => {
//   res.rows.forEach(user => {
//     console.log(`${user.cohort}: ${user.teacher}`);
//   });
// }).catch(err => console.error('query error', err.stack));
