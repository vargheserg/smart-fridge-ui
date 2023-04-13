/** @format */

import "./Dashboard.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import NavigatorComponent from "../../components/navigator/NavigatorComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import {
  getFridgeFromDB,
  updateFridgeTrackingFromDB,
  db,
  getUserFromDB,
} from "../../firebase/firebase";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import {
  getFirestore,
  query,
  getDocs,
  setDoc,
  collection,
  where,
  addDoc,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function Dashboard() {
  const [userAcc] = useContext(UserContext);
  const [items, setItems] = useState({});
  const [tracking, setTracking] = useState({});
  const [trackingForm, setTrackingForm] = useState({});
  const [image, setImage] = useState("");
  const [missingIngredients, setMissingIngredients] = useState({});
  const [show, setShow] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientCount, setNewIngredientCount] = useState(0);
  const { fridge_id } = useParams();
  let navigate = useNavigate();

  const listenToFridgeChanges = async (uid) => {
    const user_doc = await getUserFromDB(uid);
    const user_doc_id = user_doc.doc_id;
    const fridgeQuery = query(collection(db, "users", user_doc_id, "fridges"));
    onSnapshot(fridgeQuery, (snapshot) => {
      console.log("fridge snapshot updated");
      retrieveFridge(uid);
    });
  };

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    listenToFridgeChanges(uid);
  }, []);

  const retrieveFridge = async (uid) => {
    const data = await getFridgeFromDB(uid, fridge_id);
    if (data != null) {
      setItems(data.items);
      setTracking(data.tracking);
      setImage(data.image);
      var missingItems = {};
      for (const [ingredient, count] of Object.entries(data.tracking)) {
        var deltaCount = count;
        if (ingredient in data.items) {
          deltaCount = deltaCount - data.items[ingredient];
        }
        if (deltaCount > 0) {
          missingItems[ingredient] = deltaCount;
        }
      }
      setMissingIngredients(missingItems);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleRemove = (ingredient) => {
    let newTrackingForm = { ...trackingForm };
    delete newTrackingForm[ingredient];
    setTrackingForm(newTrackingForm);
  };

  const handleAdd = () => {
    let newTrackingForm = { ...trackingForm };
    const toAdd = newIngredientCount;
    if (newIngredient) {
      newTrackingForm[newIngredient] = toAdd;
      setNewIngredient("");
      setNewIngredientCount(0);
      setTrackingForm(newTrackingForm);
    }
  };

  const handleEdit = (ingredient, newCount) => {
    if (parseInt(newCount) != NaN) {
      let newTrackingForm = { ...trackingForm };
      newTrackingForm[ingredient] = newCount;
      setTrackingForm(newTrackingForm);
    }
  };

  const handleSubmit = () => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      updateFridgeTrackingFromDB(uid, fridge_id, trackingForm);
      retrieveFridge(uid);
      handleClose();
    }
  };

  const handleShow = () => {
    setShow(true);
    setTrackingForm(tracking);
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      retrieveFridge(uid);
    }
  }, [userAcc, show]);

  const getImgSrc = () => `data:image/jpeg;base64,${image}`;

  return (
    <div className="Dashboard">
      <Header />
      <div class="card-component">
        <Card style={{ width: "18rem" }} class="card">
          <Card.Body>
            <Card.Title>Ingredients</Card.Title>
            <ListGroup variant="flush">
              {Object.entries(items).map(([ingredient, count]) => (
                <ListGroup.Item key={ingredient}>
                  {ingredient} {count}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card
          style={{ width: "18rem", cursor: "pointer" }}
          onClick={handleShow}
          class="card"
        >
          <Card.Body>
            <Card.Title>Grocery List</Card.Title>
            <ListGroup variant="flush">
              {Object.entries(missingIngredients).map(([ingredient, count]) => (
                <ListGroup.Item key={ingredient}>
                  {ingredient} {count}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={image !== null ? getImgSrc() : ""} />
          <Card.Body>
            <Card.Title>Check Out Your Fridge</Card.Title>
          </Card.Body>
        </Card>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Track Ingredients</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.entries(trackingForm).map(([ingredient, count]) => (
              <div key={ingredient} class="form-row">
                <Row>
                  <Col xs={4}>
                    <div class="row-element">{ingredient}</div>
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      placeholder={count}
                      onChange={(e) => handleEdit(ingredient, e.target.value)}
                    />
                  </Col>
                  <Col xs={1}>
                    <div class="row-element">
                      <CloseButton onClick={(e) => handleRemove(ingredient)} />
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
            <div class="form-row">
              <Row>
                <Col xs={4}>
                  <Form.Control
                    placeholder="Ingredient"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                  />
                </Col>
                <Col xs={7}>
                  <Form.Control
                    value={newIngredientCount}
                    onChange={(e) =>
                      setNewIngredientCount(parseInt(e.target.value))
                    }
                  />
                </Col>
                <Col xs={1}>
                  <div class="add">
                    <CloseButton onClick={(e) => handleAdd()} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Button
                  variant="primary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
      <NavigatorComponent />
      <Footer />
    </div>
  );
}

export default Dashboard;
