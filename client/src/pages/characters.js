import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ImgMediaCard from "../Components/cardComponent";
import Button from "react-bootstrap/Button";
import ModalCharacter from "../Components/modalComponent";
import Modal from "react-bootstrap/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem, Select } from "@mui/material";

export default function Characters() {
  const id = useParams().id;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const [gender, setGender] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    console.log("Submitted");
    console.log(name, role, profile_picture, gender);
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  let userRole = localStorage.getItem("userRole");

  const string =
    userRole === "M" ? "Add Character" : "Request Character Addition";

  const getCharacters = async () => {
    try {
      setLoading(true);
      const characters = await axios.post(
        `http://localhost:3000/getCharacters`,
        { id }
      );
      setCharacter(characters.data);
      console.log(characters.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getCharacters();
  }, []);

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{id}</h1>
      <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
        {character.map((C, index) => (
          <ImgMediaCard
            key={index}
            name={C.character_name}
            id={C.character_id}
            role={C.ROLE}
            gender={C.gender}
            profilePic={C.profile_picture}
          />
        ))}
      </ul>

      <Button variant="primary" onClick={handleShow}>
        {string}
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Character
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            {/* <TextField
              label="Character ID"
              variant="outlined"
              margin="normal"
              required
              type="number"
              
            /> */}
            <TextField
              label="Character Name"
              variant="outlined"
              margin="normal"
              required
              /* You can add onChange event handler to capture the input */
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Role"
              variant="outlined"
              margin="normal"
              required
              /* You can add onChange event handler to capture the input */
              onChange={(e) => setRole(e.target.value)}
            />
            {/* <InputLabel id="demo-simple-select-label">Gender</InputLabel> */}
            <Select
              className="mt-2"
              id="gender"
              value={gender} // Use the state variable as the value of the Select component
              label="Select Gender"
              onChange={(e) => setGender(e.target.value)}
              placeholder="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <TextField
              label="Profile Picture URL"
              variant="outlined"
              margin="normal"
              onChange={(e) => setProfilePicture(e.target.value)}
              /* You can add onChange event handler to capture the input */
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
/**
<Button variant="primary" onClick={() => setModalShow(true)}>
        Add Characters
      </Button>

      <ModalCharacter
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
 */
