import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ModalCharacter(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    console.log("Submitted");
  };

  return (
    <Modal
      {...props}
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
          <TextField
            label="Character ID"
            variant="outlined"
            margin="normal"
            required
            type="number"
            /* You can add onChange event handler to capture the input */
          />
          <TextField
            label="Character Name"
            variant="outlined"
            margin="normal"
            required
            /* You can add onChange event handler to capture the input */
          />
          <TextField
            label="Role"
            variant="outlined"
            margin="normal"
            required
            /* You can add onChange event handler to capture the input */
          />
          <TextField
            label="Gender"
            variant="outlined"
            margin="normal"
            /* You can add onChange event handler to capture the input */
          />
          <TextField
            label="Profile Picture URL"
            variant="outlined"
            margin="normal"
            /* You can add onChange event handler to capture the input */
          />
        </FormControl>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" onClick={handleSubmit}></Button>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

// function App() {
//   const [modalShow, setModalShow] = React.useState(false);

//   return (
//     <>
//       <Button variant="primary" onClick={() => setModalShow(true)}>
//         Launch vertically centered modal
//       </Button>

//       <MyVerticallyCenteredModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//       />
//     </>
//   );
// }

// render(<App />);
