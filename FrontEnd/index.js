document.addEventListener('DOMContentLoaded', () => {
	const filter = document.getElementById('filter');
	const gallery = document.getElementById('gallery');
	const token = localStorage.getItem('token');
	const portfolio = document.getElementById('portfolio');
	let categname = 'tous';

	//change la couleur du bouton pour montrer qu'il et activer
	function removeColor(element) {
		const filterButtons = document.querySelectorAll('#filter input[type="button"]');
		filterButtons.forEach((button) => button.classList.remove('active'));
		element.classList.add('active');
	}
	//crée les boutton pour les filtre
	function createFilter(name) {
		const buttonFilter = document.createElement('input');
		buttonFilter.value = name;
		buttonFilter.type = 'button';
		buttonFilter.addEventListener('click', () => {
			removeColor(buttonFilter);
			categname = buttonFilter.value;
			getworks();
		});
		filter.appendChild(buttonFilter);
	}

	//recupere les info avec fetch pour créer les boutton de filtre
	function getCategory() {
		fetch('http://localhost:5678/api/categories')
			.then((response) => response.json())
			.then((response) => {
				const buttonFilter = document.createElement('input');
				buttonFilter.value = 'tous';
				buttonFilter.type = 'button';
				buttonFilter.className = 'active';
				buttonFilter.addEventListener('click', () => {
					removeColor(buttonFilter);
					categname = buttonFilter.value;
					getworks();
				});
				filter.appendChild(buttonFilter);
				const objectLength = Object.keys(response).length;
				for (let categ = 0; categ < objectLength; categ++) {
					createFilter(response[categ].name);
				}
			})
			.catch((error) => console.log('Erreur : ' + error));
	}
	//créer laffichage pour chaque travaux avec les parametre
	function createworks(img, titel) {
		const figure = document.createElement('figure');
		const image = document.createElement('img');
		const figcaption = document.createElement('figcaption');

		image.src = img;
		image.alt = titel;
		figcaption.textContent = titel;
		figure.appendChild(image);
		figure.appendChild(figcaption);
		gallery.appendChild(figure);
	}
	//récupér les data de works pour les afficher
	function getworks() {
		fetch('http://localhost:5678/api/works')
			.then((response) => response.json())
			.then((response) => {
				if (categname === 'tous') {
					const objectLength = Object.keys(response).length;
					gallery.innerHTML = '';
					for (let works = 0; works < objectLength; works++) {
						createworks(response[works].imageUrl, response[works].title);
					}
				} else {
					const idspes = response.filter((item) => item.category.name === categname);
					const objectLength = Object.keys(idspes).length;
					gallery.innerHTML = '';
					for (let works = 0; works < objectLength; works++) {
						createworks(idspes[works].imageUrl, idspes[works].title);
					}
				}
			})
			.catch((error) => console.log('Erreur : ' + error));
	}

	function buttonModifi() {
		const modifier = document.createElement('a');
		modifier.textContent = 'Modifier';
		modifier.href = '#';
		modifier.addEventListener('click', () => {});
		const h2Portfolio = portfolio.querySelector('h2');
		h2Portfolio.appendChild(document.createTextNode(' '));
		h2Portfolio.appendChild(modifier);
	}

	if (token) {
		buttonModifi();
		console.log('connecter!');
	}
	getCategory();
	getworks();
});
/* window.addEventListener('beforeunload', function () {
	localStorage.removeItem('token');
}); */
