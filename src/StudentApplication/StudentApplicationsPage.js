
import React, { useState, useEffect } from "react";
import StudentApplications from "./StudentApplications"

// Mock data for backup
const studentApplicationsMockData = [
  {
    no: 1,
    school: 'Bamberg University',
    semester: 'Spring',
  },
  {
    no: 2,
    school: 'University of Saarland',
    semester: 'Spring',
  },
  {
    no: 3,
    school: 'ESIEE Paris',
    semester: 'Spring',
  },
  {
    no: 4,
    school: 'Kingston',
    semester: 'Spring',
  },
  {
    no: 5,
    school: 'Kingston',
    semester: 'Spring',
  }
];


// student applications page, fetch data:
function StudentApplicationsPage({loggedIn, setLoggedIn, role}) {


  // student applications
  const [studentApplications, setStudentApplications] = useState();
  console.log("iğrenç")
  const username = JSON.parse(localStorage.getItem('username'))
  console.log( JSON.parse(localStorage.getItem('username')) )
  // FETCH STUDENT APPLICATIONS!
  useEffect(() => {
    fetch("http://localhost:8080/application/erasmus/"+ username)
      .then((response) => response.json())
      .then((studentApplications) => setStudentApplications(studentApplications));
  }, []);
  if (!studentApplications)
    return null;

  // return all application process:
  return (
    <div>
      <StudentApplications applications={studentApplications} username={username}></StudentApplications>
    </div>
  );
}

export default StudentApplicationsPage;