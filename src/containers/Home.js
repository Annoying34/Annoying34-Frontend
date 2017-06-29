import React, { Component } from 'react';
import { HelpBlock, Badge, Glyphicon, Image } from 'react-bootstrap';
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
			password: '',
      		name: '',
			forename: '',
			showCompanies: false,
            companies: companiesJson,
			texts: {
				startDescription: "Du kannst entweder aus einer Liste von Firmen diejenigen auswählen die du anschreiben möchtest oder wir suchen in deinen E-Mails nach Firmen und du kannst diese dann durchsuchen.\nWenn wir für dich nach Firmen suchen sollen brauchen wir deine E-Mail Adresse und passwort.\nWir werden dabei nur nach Metadaten in deinen Emails suchen, die Nachrichten und Anhänge sehen wir dabei nicht.\nZusätzlich ist es dann möglich eine E-Mail direkt über ihren Email Provider zu senden."
			}
    	};
  	}
	
	// Companies Email
	
	validateEmailLogin() {
		
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		return 	this.state.email.length > 0 &&
				this.state.password.length > 0 &&
                re.test(this.state.email)
	}
	
	fetchCompanies = (event) => {
		fetch('http://annoying34.konstantindeichmann.de/companies', {
  			method: 'POST',
  			headers: {
    			'Content-Type': 'application/json',
  			}, body: JSON.stringify({
    			email: '',
    			password: '',
  			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.setState({showCompanies: true})
		});
	}
	
	showCompanies = (event) => {
		fetch('http://annoying34.konstantindeichmann.de:8080/companies', {
  			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.setState({showCompanies: true})
		});
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

    rows = () => {
        var rows = [];
        this.state.companies.companies.forEach(function (company, i) {
            rows.push(
                <ListGroupItem 
					key={i.toString()} 
					onClick={this.onItemSelect.bind(this, company)}
					className="Company-List-Element">
						<Image className="CompanyIcon" src={company.icon} /> {company.name} {company.active && <Badge><Glyphicon glyph="ok"/></Badge>}
				</ListGroupItem>
            );
        }, this);
        return rows;
    }

	render() {
   		return (
   			<div className="FormInfo">
				<FormGroup className="Login" bsSize="large">
					<HelpBlock className="DescriptionLabel">{this.state.texts.startDescription}</HelpBlock>
				</FormGroup>
				<FormGroup className="EmailSearch" bsSize="large">
					<FormGroup controlId="email" bsSize="large">
						<ControlLabel> E-Mail </ControlLabel>
						<FormControl className="EmailInput" type="text" value={this.state.email} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<ControlLabel> Passwort </ControlLabel>
						<FormControl className="PasswordInput" type="password" value={this.state.password} onChange={this.handleChange} />
					</FormGroup>
					<Button block onClick={	this.fetchCompanies } disabled={ ! this.validateEmailLogin() } bsSize="large" type="submit"> Emails durchsuchen </Button>
					<Button block onClick={	this.showCompanies } bsSize="large" type="submit"> Manuell druchsuchen </Button>
				</FormGroup>
				{ this.state.showCompanies && 
					<div className="CompanyList">
						<FormGroup controlId="company" bsSize="large">
							<ControlLabel>Companies</ControlLabel>
                    		<ListGroup className="Company-List">
                        		{this.rows()}
                    		</ListGroup>
						</FormGroup>
					</div>
				}
			</div>
		);
  	}
}

export default Home;

   			  /*<form onSubmit={this.handleSubmit}>
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
   			</div>*/

