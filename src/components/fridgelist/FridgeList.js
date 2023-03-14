import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import Card from 'react-bootstrap/Card';
import './FridgeList.css';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getFridgesFromDB } from '../../firebase/firebase';
import { Link, useNavigate } from "react-router-dom";
const FridgeList = () => {
  const [userAcc] = useContext(UserContext);
  const [fridges, setFridges] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      retrieveFridges(uid);
    }
  }, [userAcc]);

  const retrieveFridges = async (id) => {
    const fridges = await getFridgesFromDB(id);
    console.log(fridges);
    setFridges(fridges);
  };

  return (
    <div class="card-component grid">
    <tbody>
        {fridges.map((fridge) => 
        <Card style={{ width: '18rem' }} class="card">
          <Card.Body>
            <Card.Title>{fridge.name} <FontAwesomeIcon style={{color:'green', size:'10px'}} icon = {faCircle}/></Card.Title>
            <ListGroup.Item>Last Updated: {new Date(fridge.last_updated * 1000).toUTCString()}</ListGroup.Item>
          </Card.Body>
        </Card>
        
        )}
    </tbody>
    </div>
  );
}

export default FridgeList;