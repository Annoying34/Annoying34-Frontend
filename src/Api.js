
class ApiManager {
	
	static fetchCompanies(email, password) {
		return fetch('http://annoying34.konstantindeichmann.de:8080/companies', {
  			method: 'GET',
  			headers: {
    			'Content-Type': 'application/json',
				'email': email,
				'password': password,
  			}}).then((response) => response.json())
	}
	
	static sendCompanies(name, email, password, companies) {
		return fetch('http://annoying34.konstantindeichmann.de:8080/companies', {
  			method: 'POST',
  			headers: {
    			'Content-Type': 'application/json',
				'email': email,
				'password': password,
				'name': name,
  			},
			body: JSON.stringify(companies)
		}).then((response) => response.text())
	}
	
	static fetchEmailBody(name) {
		return fetch('http://annoying34.konstantindeichmann.de:8080/mail/body', {
  			method: 'GET',
  			headers: {
				'name': name,
  			}}).then((response) => response.text())
	}
	
	static fetchEmailSubject() {
		return fetch('http://annoying34.konstantindeichmann.de:8080/mail/header', {
  			method: 'GET'
		}).then((response) => response.text())
	}
}

module.exports = ApiManager