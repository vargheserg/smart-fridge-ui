import React from 'react';
import './Header.css';
const axios = require('axios').default;

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        Smart Fridge Prototype
        {/* <button onClick={this.getHeader}>
        Click me!
        </button> */}
      </div>
    );
  }
}
export default Header;