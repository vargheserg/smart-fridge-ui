import * as React from 'react';
import Card from 'react-bootstrap/Card';
import './CardComponent.css';
import ListGroup from 'react-bootstrap/ListGroup';

function CardComponent() {
  return (
      <Card style={{ width: '18rem' }} class="card">
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <ListGroup variant="flush">
            {props.items}
          </ListGroup>
        </Card.Body>
      </Card>
  );
}

export default CardComponent;