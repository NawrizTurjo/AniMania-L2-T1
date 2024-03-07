import axios from "axios";
import React, { useEffect, useState } from "react";
import PlanCard from "../Components/planCard";
import CurrentPlanCard from "../Components/currentPlanCard";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TextField } from "@mui/material";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  let userEmail = localStorage.getItem("email");
  const [currentPlan, setCurrentPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newPlan, setNewPlan] = useState({
    planName: "",
    planInterval: "",
    planValue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleAddPlan = async () => {
    try {
      await axios.post("http://localhost:3000/addNewPlan", 
        {userEmail, ...newPlan},
      );
      console.log(newPlan);
      handleClose();
      setNewPlan({
        planName: "",
        planInterval: "",
        planValue: "",
      });
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleUpdate = () => {
    setUpdate((prev) => !prev);
  };

  let userRole = localStorage.getItem("userRole");
  const getAllPlans = async () => {
    try {
      setLoading(true);
      const allPlans = await axios.get(`http://localhost:3000/getAllPlans`);
      setPlans(allPlans.data);
      console.log(allPlans.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getCurrentPlan = async () => {
    try {
      setLoading(true);
      const getCurrentPlan = await axios.post(
        `http://localhost:3000/getCurrentPlan`,
        { userEmail }
      );
      setCurrentPlan(getCurrentPlan.data[0]);
      console.log(getCurrentPlan.data);
      console.log(getCurrentPlan.data[0].plan_name);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    console.log(userEmail);
    getAllPlans();
  }, []);

  useEffect(() => {
    getCurrentPlan();
  }, [update]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url("bg-fotor.jpg") no-repeat center center fixed`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1>Our Plans</h1>
        <PlanCard plans={plans} toggleUpdate={toggleUpdate} />
        {userRole === "U" ? (
          <CurrentPlanCard
            currentPlan={currentPlan}
            toggleUpdate={toggleUpdate}
          />
        ) : (
          <Button variant="primary" onClick={handleShow}>
            Add Plan
          </Button>
        )}
        <Modal
          show={show}
          onHide={() => setShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add a new Plan
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <TextField
                label="Plan Name"
                name="planName"
                value={newPlan.planName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Plan Interval (Days)"
                name="planInterval"
                type="number"
                value={newPlan.planInterval}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Plan Value"
                name="planValue"
                type="number"
                value={newPlan.planValue}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="contained" onClick={handleAddPlan}
            style={{backgroundColor: "green", color: "white", fontWeight: "bold", outline: "none", border: "none"}}
            >
              Add Plan
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
