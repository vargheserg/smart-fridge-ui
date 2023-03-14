import { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import './NavigatorComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrip } from '@fortawesome/free-solid-svg-icons'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
function NavigatorComponent() {
  const [userAcc, setUser] = useContext(UserContext);
  let navigate = useNavigate();

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("Auth Token");
    sessionStorage.removeItem("uid");  
  }
  
  return (
    
    <div class="nav-component">
      <Card style={{ height: '4rem' }}>
      <Card.Body>
        <FontAwesomeIcon icon = {faDoorOpen}  onClick={(e) => logout()}/>
        <div class="vr"></div>
        <FontAwesomeIcon icon = {faGrip} onClick={(e) => navigate("/fridges")}/>
        <div class="vr"></div>
        <FontAwesomeIcon icon = {faUtensils}/>
      </Card.Body>
    </Card>
    
    </div>
  );
}

export default NavigatorComponent;