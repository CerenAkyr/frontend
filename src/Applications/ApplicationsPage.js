import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import "../Courses/Courses.css";

const ApplicationsPage = ({ loggedIn, setLoggedIn }) => {
  const [applications, setApplications] = useState([]);
  const [erroredApplications, setErroredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalDetailsShow, setModalDetailsShow] = useState();
  const [applicationState, setApplicationState] = useState("NO_FILE");

  setLoggedIn(true);

  useEffect(() => {
    fetch("http://localhost:8080/state/placement/erasmus/CS")
      .then((response) => response.json())
      .then((applicationState) => {
        setApplicationState(applicationState);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/application/erasmus/all")
      .then((response) => response.json())
      .then((applications) => setApplications(applications));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/application/erasmus/wrongapps/CS")
      .then((response) => response.json())
      .then((erroredApplications) =>
        setErroredApplications(erroredApplications)
      );
  }, []);

  console.log(erroredApplications);

  const openModal = (applications) => {
    setSelectedApplication(applications);
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const setDetailsModalHandler = (application) => {
    setModalDetailsShow(true);
    setSelectedApplication(application);
  };

  const activatePlacementsHandler = () => {
    // Send a request to the backend to activate the Erasmus placements
    fetch(`http://localhost:8080/application/erasmus/activate/CS`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(window.location.reload(false));
  };

  const cancelHandler = (application) => {
    // Change the status of the application to "CANCELLED"
    application.status = "CANCELED";

    // Send the updated application to the backend
    fetch(`http://localhost:8080/application/erasmus/${application.id}/true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    })
      .then((response) => response.json())
      .then((updatedApplication) => {
        // Update the application in the state
        setApplications((prevApplications) =>
          prevApplications.map((prevApplication) =>
            prevApplication.id === updatedApplication.id
              ? updatedApplication
              : prevApplication
          )
        );
      })
      .then(window.location.reload(false));
  };

  console.log(applicationState);

  const compareStatus = (a, b) => {
    if (a.status === "PLACED") {
      return -1;
    }
    if (b.status === "PLACED") {
      return 1;
    }
    if (a.status < b.status) {
      return 1;
    }
    if (a.status > b.status) {
      return -1;
    }
    return 0;
  };

  const startPlacementsHandler = () => {
    // Send the updated application to the backend
    fetch(`http://localhost:8080/application/erasmus/placement/CS`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).then( () => { 
      setTimeout(2000 );
      window.location.reload(false)});
  };

  if (applicationState === "NO_FILE" || applicationState === "FILE_UPLOADED") {
    return (
      <div>
        <h1>Applications have not been created</h1>
      </div>
    );
  } else if (applicationState === "APPS_CREATED") {
    return (
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exchange Score</th>
            <th>Approval Status</th>
            <th>Details</th>
            <th>
              <button onClick={() => activatePlacementsHandler()}>
                Activate Placement
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                {application.student.firstName} {application.student.lastName}
              </td>
              <td>
                {parseFloat(application.student.exchangeScore.toFixed(3))}
              </td>
              <td>{application.status.toLowerCase()}</td>
              <td>
                <button
                  onClick={() => setDetailsModalHandler(application)}
                  className="details__button"
                >
                  Details
                </button>
              </td>
              <td>
                {application.status !== "CANCELED" && (
                  <CancelIcon
                    onClick={() => cancelHandler(application)}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <Modal
          show={modalDetailsShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            {selectedApplication && (
              <div>
                <div>
                  <b>Choice 1:</b> {selectedApplication.choice1?.name}
                </div>
                <div>
                  <b>Choice 2:</b> {selectedApplication.choice2?.name}
                </div>
                <div>
                  <b>Choice 3:</b> {selectedApplication.choice3?.name}
                </div>
                <div>
                  <b>Choice 4:</b> {selectedApplication.choice4?.name}
                </div>
                <div>
                  <b>Choice 5:</b> {selectedApplication.choice5?.name}
                </div>{" "}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalDetailsShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </table>
    );
  } else if (applicationState === "ACTIVATED") {
    return (
      <div>
        <div>
          <h1>There are semester conflicts in the following applications:</h1>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Exchange Score</th>
              <th>Approval Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {erroredApplications.map((application) => (
              <tr key={application.id}>
                <td>
                  {application.student.firstName} {application.student.lastName}
                </td>
                <td>
                  {parseFloat(application.student.exchangeScore.toFixed(3))}
                </td>
                <td>{application.status.toLowerCase()}</td>
                <td>
                  <button
                    onClick={() => setDetailsModalHandler(application)}
                    className="details__button"
                  >
                    Details
                  </button>
                </td>
                <td>
                  {application.status !== "CANCELED" && (
                    <CancelIcon
                      onClick={() => cancelHandler(application)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <Modal
            show={modalDetailsShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>
              {selectedApplication && (
                <div>
                  <div>
                    <b>Choice 1:</b> {selectedApplication.choice1?.name}
                  </div>
                  <div>
                    <b>Choice 2:</b> {selectedApplication.choice2?.name}
                  </div>
                  <div>
                    <b>Choice 3:</b> {selectedApplication.choice3?.name}
                  </div>
                  <div>
                    <b>Choice 4:</b> {selectedApplication.choice4?.name}
                  </div>
                  <div>
                    <b>Choice 5:</b> {selectedApplication.choice5?.name}
                  </div>{" "}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setModalDetailsShow(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </table>
      </div>
    );
  } else if (applicationState === "APPS_CORRECT") {
    return (
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exchange Score</th>
            <th>Approval Status</th>
            <th>Details</th>
            <th>
              <button onClick={() => startPlacementsHandler()}>
                Start Placements
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                {application.student.firstName} {application.student.lastName}
              </td>
              <td>
                {parseFloat(application.student.exchangeScore.toFixed(3))}
              </td>
              <td>{application.status.toLowerCase()}</td>
              <td>
                <button
                  onClick={() => setDetailsModalHandler(application)}
                  className="details__button"
                >
                  Details
                </button>
              </td>
              <td>
                {application.status !== "CANCELED" && (
                  <CancelIcon
                    onClick={() => cancelHandler(application)}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <Modal
          show={modalDetailsShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            {selectedApplication && (
              <div>
                <div>
                  <b>Choice 1:</b> {selectedApplication.choice1?.name}
                </div>
                <div>
                  <b>Choice 2:</b> {selectedApplication.choice2?.name}
                </div>
                <div>
                  <b>Choice 3:</b> {selectedApplication.choice3?.name}
                </div>
                <div>
                  <b>Choice 4:</b> {selectedApplication.choice4?.name}
                </div>
                <div>
                  <b>Choice 5:</b> {selectedApplication.choice5?.name}
                </div>{" "}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalDetailsShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </table>
    );
  } else if (applicationState === "PUBLISHED") {
    return (
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exchange Score</th>
            <th>Approval Status</th>
            <th>Placed Institution</th>
          </tr>
        </thead>
        <tbody>
          {applications.sort(compareStatus).map((application) => (
            <tr key={application.id}>
              <td>
                {application.student.firstName} {application.student.lastName}
              </td>
              <td>
                {parseFloat(application.student.exchangeScore.toFixed(3))}
              </td>
              <td>{application.status.toLowerCase()}</td>
              <td>
                  {application.status === "PLACED" && application.placedSchool.name}
                  {application.status !== "PLACED" && "-"}
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
    );
  }

  return <div>NULL STATE</div>;
};

export default ApplicationsPage;
