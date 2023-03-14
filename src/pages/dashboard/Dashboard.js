import './Dashboard.css';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavigatorComponent from '../../components/navigator/NavigatorComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { getFridgeFromDB } from '../../firebase/firebase';
import Fridge from './Fridge.jpg'
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
function Dashboard() {
  const [userAcc] = useContext(UserContext);
  const [fridge, setFridge] = useState({tracking: [], items: []});
  const {fridge_id} = useParams()
  let navigate = useNavigate();

  const retrieveFridge = async (uid) => {
    const data = await getFridgeFromDB(uid, fridge_id);
    console.log(data);
    if(data != null)
      setFridge(data);
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      retrieveFridge(uid)
    }
  }, [userAcc]);

  return (
    <div className="Dashboard">
      <Header />   
      <div class="card-component">
        <Card style={{ width: '18rem' }} class="card">
          <Card.Body>
            <Card.Title>My Fridge's Contents</Card.Title>
            <ListGroup variant="flush">
            {fridge.items.map((item) => 
              <ListGroup.Item key={item}>{item}</ListGroup.Item>
            )}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card style={{ width: '18rem' }} class="card">
          <Card.Body>
            <Card.Title>Tracking</Card.Title>
            <ListGroup variant="flush">
            {fridge.tracking.map((item) => 
              <ListGroup.Item key={item}>{item}</ListGroup.Item>
            )}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={Fridge} />
          <Card.Body>
            <Card.Title>Check Out Your Fridge</Card.Title>
          </Card.Body>
        </Card>
    </div>
        <NavigatorComponent/>   
        <Footer />    
      </div>
  );
}

export default Dashboard;