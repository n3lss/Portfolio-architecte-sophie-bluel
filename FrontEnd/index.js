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
	
	// recupere les info avec fetch
	function getfetch(url) {
		return fetch(url)
			.then((response) => response.json())
			.catch((error) => console.log('Erreur : ' + error));
	}
	//crée les boutton pour les filtre
	async function createFilter() {
		try {
			const name = await getfetch('http://localhost:5678/api/categories');
			const buttonFilter = document.createElement('input');
			buttonFilter.value = 'tous';
			buttonFilter.type = 'button';
			buttonFilter.className = 'active';
			buttonFilter.addEventListener('click', () => {
				removeColor(buttonFilter);
				categname = buttonFilter.value;
				createWorks();
			});
			filter.appendChild(buttonFilter);
			const objectLength = Object.keys(name).length;
			for (let categ = 0; categ < objectLength; categ++) {
				const buttonFilter = document.createElement('input');
			buttonFilter.value = name[categ].name;
			buttonFilter.type = 'button';
			buttonFilter.addEventListener('click', () => {
				removeColor(buttonFilter);
				categname = buttonFilter.value;
				createWorks();
			});
			filter.appendChild(buttonFilter);
				}
		} catch (error) {
			console.log("Erreur lors du traitement des filtre:", error);
		}
	}

	// crée les affichage pour les travaux
	async function createWorks() {
		try {
			const response = await getfetch('http://localhost:5678/api/works');
			if (categname === 'tous') {
				const objectLength = Object.keys(response).length;
				gallery.innerHTML = '';
				for (let works = 0; works < objectLength; works++) {
					const figure = document.createElement('figure');
					const image = document.createElement('img');
					const figcaption = document.createElement('figcaption');

					image.src = response[works].imageUrl;
					image.alt = response[works].title;
					figcaption.textContent = response[works].title;
					figure.appendChild(image);
					figure.appendChild(figcaption);
					gallery.appendChild(figure);
				}
			} else {
				const idspes = response.filter((item) => item.category.name === categname);
				const objectLength = Object.keys(idspes).length;
				gallery.innerHTML = '';
				for (let works = 0; works < objectLength; works++) {
					const figure = document.createElement('figure');
					const image = document.createElement('img');
					const figcaption = document.createElement('figcaption');

					image.src = idspes[works].imageUrl;
					image.alt = idspes[works].title;
					figcaption.textContent = idspes[works].title;
					figure.appendChild(image);
					figure.appendChild(figcaption);
					gallery.appendChild(figure);
				}
			}
		} catch (error) {
			console.log("Erreur lors du traitement des travaux :", error);
		}
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
	console.log(token);
	if (token) {
		buttonModifi();
		console.log('connecter!');
	}
	createFilter()
	createWorks();
});
/* window.addEventListener('beforeunload', function () {
	localStorage.removeItem('token');
}); */
