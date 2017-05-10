import React, { Component } from 'react';
import './Home.css';

var companiesJson = require('../../public/companies.json');

import {
  	Button,
  	FormGroup,
  	FormControl,
  	ControlLabel,
    ListGroup,
    ListGroupItem,
} from 'react-bootstrap';

class Home extends Component {

	constructor(props) {
    	super(props);

    	this.state = {
      		email: '',
      		name: '',
			forename: '',
            companies: companiesJson
    	};
  	}

	validateForm() {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return 	this.state.email.length > 0 &&
				this.state.name.length > 0 &&
				this.state.forename.length > 0 &&
                re.test(this.state.email)
  	}

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
	}

    onClick = (event) => {
		var mailto = `mailto:${this.state.email}?bcc=${encodeURIComponent(this.bcc())}&subject=${encodeURIComponent(this.subject())}&body=${encodeURIComponent(this.text())}`;
        window.location.href = mailto;
    }

	onItemSelect = (company, event) => {
		company.active = !company.active;
		this.setState({renderedAt: event.target.id})
    }

	bcc() {
		return this.state.companies.companies.filter(function(obj) {
			return obj.active
		}).map(function(obj) {
			return obj.email
		}).join(',');
	}

	subject() {
		return "Antrag auf Auskunftserteilung nach § 34 Bundesdatenschutzgesetz"
	}

	text() {
		return `Sehr geehrte Damen und Herren,\n\nbitte erteilen Sie mir gemäß § 34 Bundesdatenschutzgesetz Auskunft über die zu meiner Person bei Ihnen gespeicherten Daten, den Zweck der Speicherung, die Herkunft der Daten und die empfangenden Stellen oder Kategorien von empfangenden Stellen, an die Daten weitergegeben wurden.\n\nSollten Sie weitere Angaben zum Nachweis meiner Identität benötigen, stehe ich Ihnen für Rückfragen zur Verfügung.\n\n Mit freundlichen Grüßen\n${this.state.forename} ${this.state.name}`
	}

    rows = () => {
        var rows = [];
        this.state.companies.companies.forEach(function (company, i) {
            rows.push(
                <ListGroupItem active={company.active} key={i.toString()} onClick={this.onItemSelect.bind(this, company)} className="Company-List-Element">{company.name}</ListGroupItem>
            );
        }, this);
        return rows;
    }

	render() {
   		return (
   			<div className="FormInfo">
   			  <form onSubmit={this.handleSubmit}>
   			    <FormGroup controlId="forename" bsSize="large">
   			      <ControlLabel>First Name</ControlLabel>
   			      <FormControl
   			        autoFocus
   			        type="text"
   			        value={this.state.forename}
   			        onChange={this.handleChange} />
   			    </FormGroup>
   			    <FormGroup controlId="name" bsSize="large">
   			      <ControlLabel>Last Name</ControlLabel>
   			      <FormControl
   			        type="text"
   			        value={this.state.name}
   			        onChange={this.handleChange} />
   			    </FormGroup>
				<FormGroup controlId="email" bsSize="large">
   			      <ControlLabel>E-Mail</ControlLabel>
   			      <FormControl
   			        type="email"
   			        value={this.state.email}
   			        onChange={this.handleChange} />
   			    </FormGroup>
				<FormGroup controlId="company" bsSize="large">
					<ControlLabel>Companies</ControlLabel>
                    <ListGroup className="Company-List">
                        {this.rows()}
                    </ListGroup>
				</FormGroup>
   			    <Button
   			      block
                  onClick={this.onClick}
   			      bsSize="large"
   			      disabled={ ! this.validateForm() }
   			      type="submit">
   			      	send email
   			    </Button>
   			  </form>
   			</div>
   		);
  }
}

export default Home;
