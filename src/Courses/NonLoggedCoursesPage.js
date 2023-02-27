import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./Courses.css";

const NonLoggedCoursesPage = ({loggedIn, setLoggedIn}) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalDetailsShow, setModalDetailsShow] = useState();

  //addCourseForm
  const [courseName, setCourseName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [equivalentCourse, setEquivalentCourse] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  
  setLoggedIn(false);
  
  useEffect(() => {
    fetch("http://localhost:8080/course/bilkent/all")
      .then((response) => response.json())
      .then((courses) => setCourses(courses));
  }, []);

  const [filteredItems, setFilteredItems] = useState(courses);

  const openModal = (course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const setDetailsModalHandler = (course) => {
    setModalDetailsShow(true);
    setSelectedCourse(course);
  }



  // Handles submitting the form to the Spring backend
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseName,
        schoolName,
        equivalentCourse,
        approvalStatus,
      }),
    });
    // Clear the form fields and close the form
    setCourseName("");
    setSchoolName("");
    setEquivalentCourse("");
    setApprovalStatus("");
  }

  function handleFilter() {
    //only show approved for now
    setFilteredItems(courses.filter((course) => course.isApproved === true));
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>School Name</th>
            <th>Equivalent Course</th>
            <th>Approval Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.school}</td>
              <td>{course.equivalent}</td>
              <td>{course.isApproved ? "Approved" : "Not Approved"}</td>
              <td>
                <button onClick={() => setDetailsModalHandler(course)}>Details</button>
              </td>
              <Modal
              show={modalDetailsShow}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
            <Modal.Body>
              <h4>{course.courseCode}</h4>
              <p>
                Quota:
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setModalDetailsShow(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
                </tr>
              ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default NonLoggedCoursesPage;
