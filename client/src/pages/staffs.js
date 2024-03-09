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
import toast, { Toaster } from "react-hot-toast";

export default function Staffs({ setProgress }) {
  const anime_id = useParams().id;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const [gender, setGender] = useState("");

  let userRole = localStorage.getItem("userRole");
  let email = localStorage.getItem("email");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    console.log("Submitted");
    console.log(name, role, profile_picture, gender, userRole, email, anime_id);
    if (name === "" || role === "") {
      toast.error("You must fill the required items");
    } else {
      try {
        await toast.promise(
          axios.post("http://localhost:3000/addStaff", {
            name,
            role,
            gender,
            profile_picture,
            userRole,
            email,
            anime_id,
          }),
          {
            loading: "Adding Character...",
            success: <b>Character Added!</b>,
            error: <b>Could not add character.</b>,
          }
        );
      } catch (err) {
        toast.error("Could not add ");
      }
      getStaffs();
      handleClose();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const string = userRole === "M" ? "Add Staff" : " ";

  const getStaffs = async () => {
    try {
      setLoading(true);
      const characters = await axios.post(`http://localhost:3000/getStaffs`, {
        id: anime_id,
      });
      setCharacter(characters.data);
      console.log(characters.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setProgress(10);
    getStaffs();
    setTimeout(() => {
      setProgress(100);
    }, 500);
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
      <Toaster position="top-right" reverseOrder={false} />
      {/* <h1>{id}</h1> */}
      <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
        {character.map((C, index) => (
          <ImgMediaCard
            key={index}
            name={C.name}
            id={C.staff_id}
            role={C.ROLE}
            gender={C.gender}
            profilePic={C.profile_picture}
          />
        ))}
      </ul>

      {userRole === "M" && (
        <Button variant="primary" onClick={handleShow}>
          {string}
        </Button>
      )}

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
            Add Staff
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
            <label>
              <b
                style={{
                  textAlign: "center",
                  fontFamily: "Courier New, monospace",
                }}
              >
                Add Gender
              </b>
            </label>
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
