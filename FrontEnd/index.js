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
	function getfetch(url, type) {
		let heade = {};
		if (!type) {
			heade = {
				method: 'GET',
			};
		} else if (type) {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			heade = {
				method: type,
				headers: headers,
			};
		}
		return fetch(url, heade)
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
			console.log('Erreur lors du traitement des filtre:', error);
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
			console.log('Erreur lors du traitement des travaux :', error);
		}
	}

	async function worksDelet() {
		try {
			const response = await getfetch('http://localhost:5678/api/works');
			const objectLength = Object.keys(response).length;
			const gestionGalery = document.getElementById('gestion-galery');
			for (let works = 0; works < objectLength; works++) {
				const figure = document.createElement('figure');
				const image = document.createElement('img');
				const figcaption = document.createElement('figcaption');
				const input = document.createElement('button');
				const trash = document.createElement('i');
				trash.className = 'fas fa-trash-alt';
				trash.ariaHidden = 'true';
				input.addEventListener('click', () => {
					getfetch(`http://localhost:5678/api/works/${response[works].id}`, 'DELETE');
				});
				input.appendChild(trash);
				image.src = response[works].imageUrl;
				image.alt = response[works].title;
				figcaption.textContent = 'edite';
				figure.appendChild(image);
				figure.appendChild(input);
				figure.appendChild(figcaption);
				gestionGalery.appendChild(figure);
			}
		} catch (error) {
			console.log('Erreur lors du traitement des travaux :', error);
		}
	}
	function creatGallery() {
		const containModalDiv = document.getElementById('contain-modal');
		containModalDiv.innerHTML = '';
		const headerContainDiv = document.createElement('div');
		headerContainDiv.className = 'header-contain';

		const h2Element = document.createElement('h2');
		h2Element.textContent = 'Galerie photo';

		const closeSpan = document.createElement('span');
		closeSpan.className = 'close';
		closeSpan.id = 'close';
		closeSpan.textContent = '×';

		headerContainDiv.appendChild(h2Element);
		headerContainDiv.appendChild(closeSpan);

		const gestionGaleryDiv = document.createElement('div');
		gestionGaleryDiv.className = 'gestion-galery';
		gestionGaleryDiv.id = 'gestion-galery';

		const footerContainDiv = document.createElement('div');
		footerContainDiv.className = 'footer-contain';

		const addButton = document.createElement('input');
		addButton.type = 'button';
		addButton.value = 'Ajouter une photo';
		addButton.id = 'AddPicture';

		const deleteLink = document.createElement('a');
		deleteLink.textContent = 'Supprimer la galerie';

		footerContainDiv.appendChild(addButton);
		footerContainDiv.appendChild(deleteLink);

		containModalDiv.appendChild(headerContainDiv);
		containModalDiv.appendChild(gestionGaleryDiv);
		containModalDiv.appendChild(footerContainDiv);
	}
	function connected() {
		//execute la fonction qui crée la modale
		creatGallery();
		//
		//modification de la page quand on et connecter
		//
		const login = document.getElementById('login');
		const modifier = document.createElement('a');
		const h2Portfolio = portfolio.querySelector('h2');
		const modal = document.getElementById('modal');
		login.textContent = 'Logout';
		login.href = '/FrontEnd/index.html';
		modifier.textContent = 'Modifier';
		modifier.href = '#';
		//fonction qui fait aparaitre la modale au click
		modifier.addEventListener('click', () => {
			modal.style.display = 'block';
			//empeche le scroll
			document.body.style.overflow = 'hidden';
		});
		//suprime le token pour se deconnecter
		login.addEventListener('click', () => {
			localStorage.removeItem('token');
		});
		h2Portfolio.appendChild(document.createTextNode(' '));
		h2Portfolio.appendChild(modifier);
		//A l'interieure de la modal
		const close = document.getElementById('close');
		const addPicture = document.getElementById('AddPicture');
		close.addEventListener('click', () => {
			modal.style.display = 'none';
			document.body.style.overflow = 'auto';
		});
		addPicture.addEventListener('click', () => {
			//execute la fonction pour afficher l'ajout de nouveaux travaux
		});
		//execute la fonction qui affiche tout les travaux et qui premet de les supprimer
		worksDelet();
	}

	if (token) {
		connected();
	}

	createFilter();
	createWorks();
});
