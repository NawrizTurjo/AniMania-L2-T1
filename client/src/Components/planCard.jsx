import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

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
    color: #4568dc;
  }
  50% {
    color: #b06ab3;
  }
  100% {
    color: #4568dc;
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
  }, []);

  return (
    <>
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
                  //   handleClose();
                }}
                disabled
              >
                Insufficient Balance..Update?
              </Button>
            )}
            {/* <Button variant="primary">Understood</Button> */}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PlanCard;
