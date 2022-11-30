import React from 'react';
import './Header.css';
const axios = require('axios').default;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {header: ''};
  }

  getHeader = () => {
    const response = axios.get(`${process.env.REACT_APP_API_URL}/`).then(
      (response) => {
        console.log('Response:  ', response);
        this.setState({header: response.data});
      }
    );  
  }

  render() {
    return (
      <div className="header">
        Smart Fridge Prototype {this.state.header}
        <button onClick={this.getHeader}>
        Click me!
        </button>
      </div>
    );
  }
}
export default Header;