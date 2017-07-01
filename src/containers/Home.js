import React, { Component } from 'react';
import { HelpBlock, Badge, Glyphicon, Image } from 'react-bootstrap';
import './Home.css';

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
			isLoading: false,
			showCompanies: false,
            companies: {},
			texts: {
				startDescription: "Du kannst entweder aus einer Liste von Firmen diejenigen auswählen die du anschreiben möchtest. Oder wir suchen in deinen E-Mails nach Firmen und du kannst diese dann durchsuchen.\nWenn wir für dich nach Firmen suchen sollen brauchen wir deine E-Mail Adresse und Passwort.\nWir werden dabei nur nach Metadaten in deinen Emails suchen, die Nachrichten und Anhänge sehen wir dabei nicht.\nZusätzlich ist es dann möglich eine E-Mail direkt über deinen Email Provider zu senden."
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
		this.setState({isLoading: true})
		fetch('http://annoying34.konstantindeichmann.de:8080/companies', {
  			method: 'GET',
  			headers: {
    			'Content-Type': 'application/json',
				'email': this.state.email,
				'password': this.state.password,
  			}})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({showCompanies: true, companies: responseJson, isLoading: false})
			});
	}
	
	showCompanies = (event) => {
		this.setState({isLoading: true})
		fetch('http://annoying34.konstantindeichmann.de:8080/companies', {
  			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({showCompanies: true, companies: responseJson, isLoading: false})
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
		
		company.selected = !company.selected;
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
        this.state.companies.forEach(function (company, i) {
            rows.push(
                <ListGroupItem 
					key={i.toString()} 
					onClick={this.onItemSelect.bind(this, company)}
					className="Company-List-Element">
						{ company.imageURL && <Image className="CompanyIcon" src={company.imageURL} />} {company.name} {company.selected && <Badge><Glyphicon glyph="ok"/></Badge>}
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
					<Button block onClick={	this.fetchCompanies } disabled={ !this.validateEmailLogin() || this.state.isLoading } bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'Emails durchsuchen'} </Button>
					<Button block onClick={	this.showCompanies } disabled={this.state.isLoading} bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'Manuell durchsuchen'} </Button>
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
