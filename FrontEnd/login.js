document.getElementById('login-form').addEventListener('submit', function (event) {
	event.preventDefault(); // Empêche l'envoi classique du formulaire

	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	var credentials = {
		email: email,
		password: password,
	};

	fetch('http://localhost:5678/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	})
		.then((response) => {
			if (response.ok) {
				response.json().then((result) => {
					localStorage.setItem('token', result.token);
					window.location.href = '/FrontEnd/index.html';
				});
			}
		})

		.catch((error) => {
			console.error('Erreur lors de la requête Fetch:', error);
		});
});
