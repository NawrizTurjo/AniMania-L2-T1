import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ImgMediaCard({ id, name, role, gender, profilePic }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="N/A"
        // height="140"
        image={profilePic}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {role || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gender: {gender || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
}
