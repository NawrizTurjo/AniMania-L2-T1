import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, styled } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  backgroundImage: "linear-gradient(to bottom right, #6a1b9a, #4527a0)",
  color: theme.palette.common.white,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  // backgroundColor: "transparent",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backdropFilter: "blur(10px)",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
}));

const CurrentPlanCard = ({ currentPlan, toggleUpdate }) => {
  // const [remainingDays, setRemainingDays] = useState(0);

  // const getRemainingDays = (endDate) => {
  //   const date1 = new Date(endDate);
  //   const date2 = new Date();
  //   const diffTime = date1 - date2;
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   console.log("Remaining Days ", diffDays);
  //   setRemainingDays(diffDays);
  //   return diffDays;
  // };

  // useEffect(() => {
  //   let isMounted = true; // Flag to prevent state updates after unmounting

  //   const fetchReviews = async () => {
  //     const newRemainingDays = await getRemainingDays();

  //     console.log(newRemainingDays);
  //     if (isMounted) {
  //       if (newRemainingDays !== remainingDays) {
  //         setRemainingDays(newRemainingDays);
  //       }

  //       // if (JSON.stringify(newReviewTimes) !== JSON.stringify(oldReviewTimes)) {
  //       //   setReviewLoading(true);
  //       //   setReviews(newReviews);
  //       //   setTimeout(() => {
  //       //     setProgress(100);
  //       //   }, 500);
  //       //   setReviewLoading(false);
  //       // }
  //     }
  //     // else {
  //     //   setReviewLoading(false);
  //     //   setReviews([]);
  //     //   setTimeout(() => {
  //     //     setProgress(100);
  //     //   }, 500);
  //     // }
  //   };

  //   const interval = setInterval(fetchReviews, 10000); // Fetch reviews every 60 seconds

  //   getRemainingDays(); // Fetch reviews on component mount

  //   return () => {
  //     clearInterval(interval); // Cleanup function to clear the interval
  //     isMounted = false; // Update the flag to prevent state updates after unmounting
  //   };
  // }, [remainingDays]); // Fetch reviews when id changes
  const [remainingDays, setRemainingDays] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");

  const getRemainingDays = async (endDate) => {
    const date1 = new Date(endDate);
    const date2 = new Date();
    const diffTime = date1 - date2;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    console.log("End Date ", date1);
    console.log("Current Date ", date2);
    console.log("Remaining Days ", diffDays);
    console.log("Remaining Hours ", diffHours);
    console.log("Remaining Minutes ", diffMinutes);
    console.log("Remaining Seconds ", diffSeconds);

    if (diffDays > 0) {
      setRemainingDays(diffDays);
      setRemainingTime(`${diffDays} days`);
    } else {
      if (diffHours > 0) {
        setRemainingTime(`${diffHours} hours`);
      } else if (diffMinutes > 0) {
        setRemainingTime(`${diffMinutes} minutes`);
      } else if (diffSeconds > 0) {
        setRemainingTime(`${diffSeconds} seconds`);
      } else {
        setRemainingTime("Expired");
      }
    }
  };

  useEffect(() => {
    if (currentPlan.plan_end_date) {
      getRemainingDays(currentPlan.plan_end_date);

      // Set interval to update remaining time every 10 seconds
      const intervalId = setInterval(() => {
        getRemainingDays(currentPlan.plan_end_date);
      }, 10000);

      // Clean up function to clear interval when component unmounts or when currentPlan changes
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentPlan.plan_end_date]);

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h4" component="div" gutterBottom>
          Current Plan
        </Typography>
        <StyledBox>
          <Row>
            <Col xs={6}>
              <Typography variant="subtitle1">Plan Name:</Typography>
            </Col>
            <Col xs={6}>
              <StyledTypography variant="body1">
                {currentPlan.plan_name}
              </StyledTypography>
            </Col>
          </Row>
        </StyledBox>
        <StyledBox>
          <Row>
            <Col xs={6}>
              <Typography variant="subtitle1">Plan End Date:</Typography>
            </Col>
            <Col xs={6}>
              <StyledTypography variant="body1">
                {currentPlan.plan_end_date}
              </StyledTypography>
            </Col>
          </Row>
        </StyledBox>
        <StyledBox>
          <Row>
            <Col xs={6}>
              <Typography variant="subtitle1">Wallet Balance:</Typography>
            </Col>
            <Col xs={6}>
              <StyledTypography variant="body1">
                {currentPlan.wallet_balance}
              </StyledTypography>
            </Col>
          </Row>
        </StyledBox>
        <StyledBox>
          <Row>
            <Col xs={6}>
              <Typography variant="subtitle1">Status:</Typography>
            </Col>
            <Col xs={6}>
              <StyledTypography variant="body1">
                {remainingTime !== "Expired" ? (
                  <span style={{ color: "#26fc0a" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>Expired</span>
                )}
              </StyledTypography>
            </Col>
          </Row>
        </StyledBox>
        <StyledBox>
          <Row>
            <Col xs={6}>
              <Typography variant="subtitle1">Remaining Time:</Typography>
            </Col>
            <Col xs={6}>
              <StyledTypography variant="body1">
                {remainingTime}
              </StyledTypography>
            </Col>
          </Row>
        </StyledBox>
      </StyledCardContent>
    </StyledCard>
  );
};

export default CurrentPlanCard;
