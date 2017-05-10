import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import RouteNavItem from './components/RouteNavItem';
import Routes from './Routes';
import './App.css';

class App extends Component {
	handleNavLink = (event) => {
  		event.preventDefault();
  		this.props.history.push(event.currentTarget.getAttribute('href'));
	}

  	render() {
  		return (
  		  <div className="App container">
  		    <Navbar fluid collapseOnSelect>
  		      <Navbar.Header>
  		        <Navbar.Brand>
  		          <Link to="/">Home</Link>
  		        </Navbar.Brand>
  		        <Navbar.Toggle />
  		      </Navbar.Header>
  		      <Navbar.Collapse>
  		        <Nav pullRight>
  		          <RouteNavItem onClick={this.handleNavLink} href="/about">About</RouteNavItem>
  		          <RouteNavItem onClick={this.handleNavLink} href="/imprint">Imprint</RouteNavItem>
  		        </Nav>
  		      </Navbar.Collapse>
  		    </Navbar>
  		    <Routes />
  		  </div>
  		);
  	}
}

export default withRouter(App);