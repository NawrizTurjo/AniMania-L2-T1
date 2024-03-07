import React from "react";
import { Card, CardContent, Typography, Box, styled } from "@mui/material";
import { Row, Col } from "react-bootstrap";

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

const CurrentPlanCard = ({ currentPlan,toggleUpdate }) => {
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
      </StyledCardContent>
    </StyledCard>
  );
};

export default CurrentPlanCard;
