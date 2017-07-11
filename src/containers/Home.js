import React, { Component } from 'react';
import { HelpBlock, Badge, Glyphicon, Image, Modal } from 'react-bootstrap';
import './Home.css';

import ApiManager from '../Api.js';

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
			isLoading: false,
			showCompanies: false,
			showSendDialog: false,
			yourCompanies: {},
            companies: {},
			texts: {
				startDescription: "Du kannst entweder aus einer Liste von Firmen diejenigen auswählen, die du anschreiben möchtest. Oder wir suchen in deinen E-Mails nach Firmen und du kannst dann aus diesen auswählen. Wenn wir für dich nach Firmen suchen sollen, brauchen wir deine E-Mailadresse und Passwort. Wir werden dabei nur nach Metadaten in deinen E-Mails suchen. Die Nachrichten und Anhänge sehen wir dabei nicht.\nZusätzlich ist es dann möglich eine E-Mail direkt über deinen E-Mail-Provider zu senden.",
				proceedDescription: "Im Folgenden kannst du Firmen auswählen, welche du auffordern möchtest, dir Informationen über gespeicherte Daten zukommen zu lassen. Firmen die Ausgewählt hast werden mit einem Haken markiert. Um Fortfahren zu können musst du mindestens deinen namen und deine Email angeben."
			},
			dialogTitle: '',
			dialogMessage: '',
			dialogSend: 'Senden',
			dialogCancel: 'Abbrechen',
    	};
  	}
	
	// Validate forms
	
	validateEmail() {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		return 	this.state.email.length > 0 && re.test(this.state.email)
	}
	
	validateLogin() {
		
		return this.validateEmail() &&
				this.state.password.length > 0
	}
	
	validateSendMailRemote() {

		return this.validateLogin() && this.state.name.length > 0
	}
	
	validateSendMailLocal() {
		
		return this.validateEmail() && this.state.name.length > 0
	}
	
	// Fetch Companies
	
	fetchCompanies = (event) => {
		this.setState({isLoading: true})
		ApiManager.fetchCompanies(this.state.email, this.state.password)
			.then((responseJson) => {
				var companies = responseJson.filter(function(company) {
					return company.selected === false
				})
				
				var yourCompanies = responseJson.filter(function(company) {
					return company.selected === true
				})

				this.setState({showCompanies: true, companies: companies, yourCompanies: yourCompanies, isLoading: false})
			});
	}
	
	showCompanies = (event) => {
		this.setState({isLoading: true})
		ApiManager.fetchCompanies('', '')
		.then((responseJson) => {
			this.setState({showCompanies: true, companies: responseJson, isLoading: false})
		});
	}
	
	// Post Companies
	
	showDialog = (event) => {
		this.setState({isLoading: true})
		ApiManager.fetchEmailBody(this.name)
		.then((body) => {
			ApiManager.fetchEmailSubject()
			.then((subject) => {
				this.setState({dialogTitle: subject, dialogMessage: body, showSendDialog: true})
			})
		})
	}
	
	hideDialog = (event) => {
		this.setState({showSendDialog:false})
	}
	
	sendCompanies = (event) => {
		this.setState({showSendDialog: false})
		ApiManager.sendCompanies(this.state.name, this.state.email, this.state.password, this.selectedCompanies())
		.then((responseJson) => {
			console.log(responseJson)
			this.setState({isLoading: false})
		});
	}
	
	openEmailClient = (event) => {
		this.setState({isLoading: true})
		ApiManager.fetchEmailBody(this.name)
		.then((body) => {
			ApiManager.fetchEmailSubject()
			.then((subject) => {
				this.setState({isLoading: false})
				var mailto = `mailto:${this.state.email}?bcc=${encodeURIComponent(this.selectedEmailAdresses().join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
				window.location.href = mailto;
			});
		});
	}
	
	// Handle I/O Events
	
	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
	}
	
	// On Click

	onItemSelect = (company, event) => {
		
		company.selected = !company.selected;
		this.setState({renderedAt: event.target.id})
    }
	
	// Helper
	
	selectedCompanies() {
		var companies = this.state.yourCompanies.concat(this.state.companies)
		return companies.filter(function(company) {
			return company.selected
		}).map(function(company) {
			return company.id
		})
	}

	selectedEmailAdresses() {
		return this.state.companies.filter(function(company) {
			return company.selected
		}).map(function(company) {
			return company.email
		})
	}

	// Modal

	modalDialog() {
		return (
		<div className="static-modal">
			<Modal show={this.state.showSendDialog}>
				<Modal.Header>
        			<Modal.Title>{this.state.dialogTitle}</Modal.Title>
      			</Modal.Header>

				<Modal.Body><p>{this.state.dialogMessage}</p></Modal.Body>

      			<Modal.Footer>
					<Button onClick={this.hideDialog}>{this.state.dialogCancel}</Button>
					<Button onClic={this.sendCompanies} bsStyle="primary">{this.state.dialogSend} (an {this.selectedCompanies.length} Firmen)</Button>
      			</Modal.Footer>

    		</Modal>
		</div>
		)
	}

	// Company Rows

    rows = (companies) => {
        var rows = [];
        companies.forEach(function (company, i) {
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
	
	// Render

	render() {
   		return (
   			<div className="FormInfo">
			{ this.state.showCompanies === false &&
				<FormGroup className="Login" bsSize="large">
					<HelpBlock className="DescriptionLabel">
						{this.state.texts.startDescription}
					</HelpBlock>
				</FormGroup> }
			{ this.state.showCompanies === false &&
				<FormGroup className="EmailSearch" bsSize="large">
					<FormGroup controlId="email" bsSize="large">
						<ControlLabel> E-Mail </ControlLabel>
						<FormControl className="EmailInput" type="text" value={this.state.email} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<ControlLabel> Passwort </ControlLabel>
						<FormControl className="PasswordInput" type="password" value={this.state.password} onChange={this.handleChange} />
					</FormGroup>
					<Button block onClick={	this.fetchCompanies } disabled={ !this.validateLogin() || this.state.isLoading } bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'Emails durchsuchen'} </Button>
					<Button block onClick={	this.showCompanies } disabled={this.state.isLoading} bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'Manuell durchsuchen'} </Button>
				</FormGroup>
			}
			{ this.state.showCompanies &&
				<FormGroup className="Login" bsSize="large">
					<HelpBlock className="DescriptionLabel">
						{this.state.texts.proceedDescription}
					</HelpBlock>
				</FormGroup> 
			}
			{ this.state.showCompanies && this.state.yourCompanies.length > 0 && 
				<div className="YourCompanyList">
					<FormGroup controlId="company" bsSize="large">
						<ControlLabel>Gefundene Firmen</ControlLabel>
                   		<ListGroup className="YourCompany-List">
                       		{this.rows(this.state.yourCompanies)}
                   		</ListGroup>
					</FormGroup>
				</div>
			}
			{ this.state.showCompanies && 
				<div className="CompanyList">
					<FormGroup controlId="company" bsSize="large">
						<ControlLabel>Uns bekannte Firmen</ControlLabel>
                   		<ListGroup className="Company-List">
                       		{this.rows(this.state.companies)}
                   		</ListGroup>
					</FormGroup>
				</div>
			}
			{ this.state.showCompanies &&
				<FormGroup className="EmailSearch" bsSize="large">
					<FormGroup controlId="name" bsSize="large">
						<ControlLabel> Name* </ControlLabel>
						<FormControl className="NameInput" type="text" value={this.state.name} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="email" bsSize="large">
						<ControlLabel> E-Mail* </ControlLabel>
						<FormControl className="EmailInput" type="text" value={this.state.email} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<ControlLabel> Passwort </ControlLabel>
						<FormControl className="PasswordInput" type="password" value={this.state.password} onChange={this.handleChange} />
					</FormGroup>
					<Button block onClick={	this.showDialog } disabled={ !this.validateSendMailRemote() || this.state.isLoading } bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'Mit Login fortfahren'} </Button>
					<Button block onClick={	this.openEmailClient } disabled={!this.validateSendMailLocal() || this.state.isLoading} bsSize="large" type="submit"> {this.state.isLoading ? 'Lädt ...' : 'E-Mail-Client öffnen'} </Button>
				</FormGroup>
			}
			{this.modalDialog()}
			</div>
		);
  	}
}

export default Home;
