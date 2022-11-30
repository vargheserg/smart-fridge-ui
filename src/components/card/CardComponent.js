import * as React from 'react';
import Card from 'react-bootstrap/Card';
import './CardComponent.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Fridge from './Fridge.jpg';

function CardComponent() {
  return (
    <div class="card-component grid">
      <Card style={{ width: '18rem' }} class="card">
        <Card.Body>
          <Card.Title>Whats in your fridge</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Cucumbers</ListGroup.Item>
            <ListGroup.Item>Carrots</ListGroup.Item>
            <ListGroup.Item>Grapes</ListGroup.Item>
            <ListGroup.Item>Eggs</ListGroup.Item>
            <ListGroup.Item>Yellow Bell Pepper</ListGroup.Item>
            <ListGroup.Item>Red Bell Pepper</ListGroup.Item>
            <ListGroup.Item>Soda</ListGroup.Item>
            <ListGroup.Item>Salad</ListGroup.Item>
            <ListGroup.Item>Lettuce</ListGroup.Item>
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
  );
}

export default CardComponent;