import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import toast, { Toast, Toaster } from "react-hot-toast";
import { TextField } from "@mui/material";

const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shadowAnimation = keyframes`
  0% {
    text-shadow: none;
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: none;
  }
`;

const colorAnimation = keyframes`
  0% {
    color: #fff3d1;
  }
  50% {
    color: #9bfc62;
  }
  100% {
    color: #fae9b9;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem;
  width: 300px;
  text-align: center;
  font-weight: bold;
  color: #ffffff;

  &:hover {
    background: linear-gradient(135deg, #b06ab3, #4568dc);
  }
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "Consolas", sans-serif;
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

const CardText = styled.p`
  margin-bottom: 0.5rem;
`;

const PlanCard = ({ plans, toggleUpdate }) => {
  const handleClick = () => {
    console.log("clicked");
  };
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [show, setShow] = useState(false);

  const [balance, setBalance] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [remainingDays, setRemainingDays] = useState(0);

  const [value, setValue] = useState(0);

  const handleCardClick = (plan) => {
    if (userRole === "U") {
      setSelectedPlan(plan);
      console.log(plan);
      setShow(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setShow(false);
  };

  let email = localStorage.getItem("email");

  const getBalance = async () => {
    try {
      const balance = await axios.post("http://localhost:3000/getbalance", {
        userEmail: email,
      });
      setBalance(balance.data);
      console.log(balance.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  let userRole = localStorage.getItem("userRole");

  const [state, setState] = useState(false);

  const handleUpdatePlan = async () => {
    if (userRole === "U") {
      try {
        const updatePlan = await axios.post(
          "http://localhost:3000/updatePlan",
          {
            userEmail: email,
            planId: selectedPlan.plan_id,
          }
        );
        console.log(updatePlan.data);
        handleCloseModal();
        getBalance();
        toggleUpdate();
        console.log("Plan Updated");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, [state]);

  //Modal 2
  const [show1, setShow1] = useState(false);

  const handleClose1 = () => {
    setShow1(false);
  };
  const handleShow1 = () => {
    handleClose();
    setShow1(true);
  };

  const addBalance = async () => {
    const loadingToastId = toast.loading("Checking Credentials..", {
      duration: 4000, // 4 seconds
      style: {
        border: "1px solid #7946a6",
        padding: "16px",
        color: "#7946a6",
      },
      iconTheme: {
        primary: "#7946a6",
        secondary: "#FFFAEE",
      },
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const addBalance = await axios.post("http://localhost:3000/addBalance", {
        email,
        value,
      });

      console.log(addBalance.data);
      setState((prev) => !prev);
      setBalance(addBalance.data);
      toast.dismiss(loadingToastId);
      handleClose1();
      toast.success("Money has been successfully added to your wallet.", {
        style: {
          border: "1px solid #7946a6",
          padding: "16px",
          color: "#7946a6",
        },
        iconTheme: {
          primary: "#7946a6",
          secondary: "#FFFAEE",
        },
      });
      setTimeout(() => {
        toast.dismiss();
      }, 5000);
      toggleUpdate();
    } catch (err) {
      toast.dismiss(loadingToastId);
      console.log(err.message);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />
      <CardContainer>
        {plans.map((plan) => (
          <Card
            key={plan.plan_id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              cursor: userRole === "U" ? "pointer" : "default",
            }}
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => handleCardClick(plan)}
          >
            <CardTitle>{plan.plan_name}</CardTitle>
            <CardText>Days: {plan.plan_interval}</CardText>
            <CardText>Cost: {plan.plan_value}</CardText>
          </Card>
        ))}
      </CardContainer>
      {selectedPlan && (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPlan.plan_name} Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Enjoy the benefits of our {selectedPlan.plan_name} plan for just
            {" " + selectedPlan.plan_value} coins every{" "}
            {selectedPlan.plan_interval} days.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              style={{
                backgroundColor: "red",
                color: "white",
                fontWeight: "bold",
                outline: "none",
                border: "none",
              }}
            >
              It's ok I'm not interested
            </Button>
            {balance >= selectedPlan.plan_value ? (
              <Button
                variant="primary"
                onClick={() => {
                  //   console.log("clicked");
                  //   handleClose();
                  handleUpdatePlan();
                }}
              >
                Subscribe
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  //   console.log("clicked");
                  handleShow1();
                }}
                // disabled
              >
                Insufficient Balance..Update?
              </Button>
            )}
            {/* <Button variant="primary">Understood</Button> */}
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        show={show1}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Money</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Enter Amount</label>
              <input
                type="number"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Amount"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Enter Credentials"
                variant="outlined"
                placeholder="Enter Credentials"
                fullWidth
                style={{ marginTop: "1rem" }}
                // value={value}
                // onChange={(e) => setValue(e.target.value)}
              ></TextField>
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            No, I'm good.
          </Button>
          <Button variant="primary" onClick={addBalance}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlanCard;
