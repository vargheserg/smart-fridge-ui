import * as React from 'react';
import Card from 'react-bootstrap/Card';
import './NavigatorComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrip } from '@fortawesome/free-solid-svg-icons'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'
function NavigatorComponent() {
  return (
    <div class="nav-component">
      <Card style={{ height: '4rem' }}>
      <Card.Body>
        <FontAwesomeIcon icon = {faDoorOpen}/>
        <div class="vr"></div>
        <FontAwesomeIcon icon = {faGrip}/>
        <div class="vr"></div>
        <FontAwesomeIcon icon = {faUtensils}/>
      </Card.Body>
    </Card>
    </div>
  );
}

export default NavigatorComponent;