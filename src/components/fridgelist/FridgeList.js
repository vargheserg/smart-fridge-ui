import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import Card from 'react-bootstrap/Card';
import './FridgeList.css';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getFridgeFromDB, getFridgesFromDB } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const FridgeList = () => {
  const [userAcc] = useContext(UserContext);
  const [fridges, setFridges] = useState([]);
  const [show, setShow] = useState(false);
  
  const [fridgeIp, setFridgeIp] = useState('127.0.0.1');
  const [fridgeName, setFridgeName] = useState('My Fridge');
  const [fridgeId, setFridgeId] = useState('my-fridge');
  const [fridgeStatus, setFridgeStatus] = useState('Not Found');
  const [validRegistration, setValidRegistration] = useState(false);

  let navigate = useNavigate();

  // Fridge List
  
  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      retrieveFridges(uid);
    }
  }, [userAcc, show]);

  const retrieveFridges = async (uid) => {
    const fridges = await getFridgesFromDB(uid);
    setFridges(fridges);
  };

  // Add Module

  const addNewFridge = () => {
    const request = {
      email: userAcc.email,
      fridge_id: fridgeId,
      fridge_name: fridgeName,
      user_id: userAcc.doc_id   
    };
    fetch(`http://${fridgeIp}:5000/register`, {method: "POST", body: JSON.stringify(request), headers: {'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then((res) => {
            if (res) {
              // Re-fetch fridges after successfully registering it
              const authToken = sessionStorage.getItem("Auth Token");
              const uid = sessionStorage.getItem("uid");
              if (uid && authToken) {
                retrieveFridges(uid);
              }
            }
        });
    setShow(false);
  };
  const handleClose = () => {
    setShow(false)
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    const ip_rx=/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
    const fridge = fridges.find(fridge => fridge.doc_id == fridgeId)
    const uniqueFridgeId = fridge == null;
    console.log(`${ip_rx.test(fridgeIp)} ${fridgeId.length} ${fridge}`);
    if(ip_rx.test(fridgeIp) && fridgeId.length > 0 && uniqueFridgeId) {
      fetch(`http://${fridgeIp}:5000/health`, {method: "GET"})
        .then(response => response.json())
        .then(data => {
          setFridgeStatus(data.status);
          setValidRegistration(data.status === "Ready");
        });
    } else {
      setValidRegistration(false);
      setFridgeStatus("Invalid Fridge");
    }
  }, [fridgeIp, fridgeId]);

  useEffect(() => {
    setFridgeIp(fridgeIp);
  }, [fridgeIp]);


  useEffect(() => {
    const fridgeIdFormatted = fridgeName.replace(/[^a-zA-Z ]/g, " ").replace(/\s+/g, '-').toLowerCase()
    setFridgeName(fridgeName);
    setFridgeId(fridgeIdFormatted);
  }, [fridgeName]);

  return (
    <div class="card-component grid">
      {fridges.map((fridge) => 
      <Card key={fridge.doc_id} data={fridge} style={{ width: '18rem' }} class="card" onClick={(e) => navigate(`/${fridge.doc_id}`)}>
        <Card.Body>
          <Card.Title>{fridge.name} <FontAwesomeIcon style={{color:'green', size:'10px'}} icon = {faCircle}/></Card.Title>
          <ListGroup.Item>Last Updated: {new Date(fridge.last_updated * 1000).toUTCString()}</ListGroup.Item>
        </Card.Body>
      </Card>
      )}
      <Card style={{ width: '18rem' }} class="card" onClick={handleShow}>
        <Card.Body>
          <Card.Title> Register New Device</Card.Title>
          <ListGroup.Item><FontAwesomeIcon icon = {faPlus}/></ListGroup.Item>
        </Card.Body>
      </Card>
      
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Fridge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="ip">Device IP</InputGroup.Text>
          <Form.Control value={fridgeIp} onChange={(e) => setFridgeIp(e.target.value)} aria-label="ip"/>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="name">Fridge Name</InputGroup.Text>
          <Form.Control value={fridgeName} onChange={(e) => setFridgeName(e.target.value)} aria-label="name"/>
        </InputGroup>
        <fieldset disabled>
          <InputGroup className="mb-3">
            <InputGroup.Text id="name">Fridge Id</InputGroup.Text>
            <Form.Control value={fridgeId} onChange={(e) => setFridgeId(e.target.value)} aria-label="ip"/>
          </InputGroup>
        </fieldset>
        <ListGroup.Item>Status: {fridgeStatus}</ListGroup.Item>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!validRegistration} onClick={addNewFridge}>
          Register Device
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default FridgeList;