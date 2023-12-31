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
	function allFetch(url, type, body) {
		let heade = {};
		if (!type) {
			heade = {
				method: type,
			};
		} else if (type) {
			const headers = {
				Authorization: `Bearer ${token}`,
				ContentType: 'multipart/form-data',
			};

			heade = {
				method: type,
				headers: headers,
				body: body,
			};
		}
		return fetch(url, heade)
			.then((response) => response.json())
			.catch((error) => console.log('Erreur : ' + error));
	}
	//crée les boutton pour les filtre
	async function createFilter() {
		try {
			const name = await allFetch('http://localhost:5678/api/categories');
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
			const response = await allFetch('http://localhost:5678/api/works');
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
	// affiche les travaux avec la corbeille pour suprimmer
	async function worksDelete() {
		try {
			const response = await allFetch('http://localhost:5678/api/works');
			const objectLength = Object.keys(response).length;
			const gestionGalery = document.getElementById('gestion-galery');
			gestionGalery.innerHTML = '';
			for (let works = 0; works < objectLength; works++) {
				const figure = document.createElement('figure');
				const image = document.createElement('img');
				const figcaption = document.createElement('figcaption');
				const input = document.createElement('button');
				const trash = document.createElement('i');
				trash.className = 'fas fa-trash-alt';
				trash.ariaHidden = 'true';
				input.addEventListener('click', () => {
					allFetch(`http://localhost:5678/api/works/${response[works].id}`, 'DELETE');

					createWorks();
					worksDelete();
				});
				input.appendChild(trash);
				image.src = response[works].imageUrl;
				image.alt = response[works].title;
				
				figure.appendChild(image);
				figure.appendChild(input);
				
				gestionGalery.appendChild(figure);
			}
		} catch (error) {
			console.log('Erreur lors du traitement des travaux dans la galery:', error);
		}
	}
	// envoie le formulaire a la bdd
	function newWorks() {
		const buttonAdd = document.getElementById('buttonAdd');
		const title = document.getElementById('titleAdd');
		const select = document.getElementById('choix');
		const categori = select.value;
		const body = new FormData()
		body.append('image', buttonAdd.files[0]);
        body.append('title', title.value);
        body.append('category', categori);

            
		
		console.log(body);
		allFetch('http://localhost:5678/api/works', 'POST', body).then((ok) => {
			console.log('post: ')
		}).catch((err) => {
			console.log(err);
		});
	}
	//crée la modal pour la gallery
	function creatGallery() {
		//recupere la div de la modal
		const containModalDiv = document.getElementById('contain-modal');
		/* containModalDiv.innerHTML = ''; */
		// crée une div pour le header de la modal
		const headerContainDiv = document.createElement('div');
		headerContainDiv.className = 'header-contain';
		//crée un h2 en lui ajoutant le texte galeri
		const h2Element = document.createElement('h2');
		h2Element.textContent = 'Galerie photo';
		// crée un i pour le bouton close avec class et id et en text une croix
		const closei = document.createElement('i');
		closei.className = 'fa-solid fa-xmark';
		closei.id = 'close';
		//crée une div pour afficher les travaux a modifier avec une class et un id
		const gestionGaleryDiv = document.createElement('div');
		gestionGaleryDiv.className = 'gestion-galery';
		gestionGaleryDiv.id = 'gestion-galery';
		// cree une div pour le footer avec une class
		const footerContainDiv = document.createElement('div');
		footerContainDiv.className = 'footer-contain';
		// crée un input de type button avec comme value 'ajouter une photo' et un id
		const addButton = document.createElement('input');
		addButton.type = 'button';
		addButton.value = 'Ajouter une photo';
		addButton.id = 'AddPictureBtn';
		// crée une balise a avec comme texte 'Supprimer la galerie'
		
		//ajoute les element dans leur div
		containModalDiv.appendChild(closei);
		headerContainDiv.appendChild(h2Element);
		footerContainDiv.appendChild(addButton);
		
		//ajoute toute les div a la modal
		containModalDiv.appendChild(headerContainDiv);
		containModalDiv.appendChild(gestionGaleryDiv);
		containModalDiv.appendChild(footerContainDiv);
		//execute la fonction qui affiche tout les travaux et qui premet de les supprimer
		worksDelete();
	}

	 function fakeButton(){
		
			//cree une div pour le faux boutton pour ajouter l'image
			const buttonimg = document.createElement('div');
			buttonimg.id = 'addImg';
			buttonimg.className = 'addImg';buttonimg.addEventListener('click', () => {
				inputAdd.click();
			});
			//crée un div pour le premier affichage avent le boutton
			const fakeButton = document.createElement('div');
			fakeButton.className = 'fakeButton';
			const picturI = document.createElement('i');
			picturI.className = 'fa-regular fa-image fa-xl';
			//cree une balise image invisible pour afficher limage quand elle sera ajouter avent lenvoie
			const img = document.createElement('img');
			img.id = 'newImg';
			img.style.display = 'none';
			//crée une input fill pour ajouter limage
			const inputAdd = document.createElement('input');
			inputAdd.type = 'file';
			inputAdd.required = 'required';
			inputAdd.id = 'buttonAdd';
			inputAdd.style.display = 'none';
			inputAdd.accept = '.jpg, .png';
			//quand l'input change elle modifi l'affichage
			inputAdd.addEventListener('change', () => {
			if (inputAdd.files.length > 0) {
				let newimg = inputAdd.files[0];
				let imgUrl = URL.createObjectURL(newimg);
				
				img.src = imgUrl;
				img.style.display = 'block';
				button.style.display = 'none';
				picturI.style.display = 'none';
				type.style.display = 'none';
			} else {
				img.src = '';
				img.style.display = 'none';
				button.style.display = 'initial';
				picturI.style.display = 'flex';
				type.style.display = 'flex';
				
			}
			});
			// faux boutton pour l'affichage
			const button = document.createElement('button');
			button.textContent = '+ Ajouter photo';
			button.type = 'button';
			//balise text pour le type de fichier et la taille max
			const type = document.createElement('span');
			type.textContent = 'jpg, png : 4mo max';
			//crée le faux boutton en regroupent tout
			fakeButton.appendChild(img);
			fakeButton.appendChild(picturI);
			fakeButton.appendChild(button);
			fakeButton.appendChild(type);
			buttonimg.appendChild(fakeButton);
			buttonimg.appendChild(inputAdd);
			const formAdd = document.getElementById('formAdd')
			formAdd.appendChild(buttonimg);
			
	}
	//créé la modal pour ajouter un projet
	async function creatAddPicture() {
		try {
			const addPicture = document.getElementById('addPicture');
			const containModal = document.getElementById('contain-modal');
			//header
			const headerAddPictureDiv = document.createElement('div');
			headerAddPictureDiv.className = 'header-add';

			const arrowi = document.createElement('i');
			arrowi.className = 'fa-solid fa-arrow-left';
			arrowi.id = 'arrow-left';
			arrowi.addEventListener('click', () => {
				addPicture.style.display = 'none';
				containModal.style.display = 'block';
			});
			const closei = document.createElement('i');
			closei.className = 'fa-solid fa-xmark';
			closei.id = 'close';
			closei.addEventListener('click', () => {
				modal.style.display = 'none';
				addPicture.style.display = 'none';
				containModal.style.display = 'block';
				document.body.style.overflow = 'auto';
			});
			const h2Element = document.createElement('h2');
			h2Element.textContent = 'Ajout photo';

			headerAddPictureDiv.appendChild(arrowi);
			headerAddPictureDiv.appendChild(closei);
			addPicture.appendChild(headerAddPictureDiv);
			addPicture.appendChild(h2Element);

			//formurlaire
			//crée une balise formulair
			const formAdd = document.createElement('form');
			formAdd.className = 'formAdd';
			formAdd.id = 'formAdd'
			
			//text pour indique qu'on doit ecrire le titre
			const titre = document.createElement('span');
			titre.textContent = 'Titre';
			titre.className = 'title';

			//input pour ajouter le titre
			const titreName = document.createElement('input');
			titreName.id = 'titleAdd';
			titreName.type = 'text';
			titreName.className = 'titreName';
			titreName.required = 'required';
			//text qui indique qu'on doit choicisre la categori
			const categorie = document.createElement('span');
			categorie.textContent = 'Catégorie';
			categorie.className = 'categorie';
			//crée un selecteur
			const select = document.createElement('select');
			select.id = 'choix';
			select.name = 'categorie';
			// fetch pour recuperer les categori et les afficher dans le choix
			const name = await allFetch('http://localhost:5678/api/categories');
			const objectLength = Object.keys(name).length;
			const defaultOption = document.createElement('option');
			defaultOption.id = 0;
			defaultOption.textContent = '';
			select.appendChild(defaultOption);
			for (let categ = 0; categ < objectLength; categ++) {
				const option = document.createElement('option');
				option.value = name[categ].id;
				option.id = name[categ].name;
				option.textContent = name[categ].name;
				select.appendChild(option);
			}
			// boutton de validation du formulaire
			const valid = document.createElement('button');
			valid.type = 'click';
			valid.textContent = 'valider'
			valid.addEventListener('click', async () => {
				await newWorks();
				createWorks();
				worksDelete();
			});
			//regroupement de tout se qui a était crée dans le formulaire
			
			addPicture.appendChild(formAdd);
			fakeButton()
			formAdd.appendChild(titre);
			formAdd.appendChild(titreName);
			formAdd.appendChild(categorie);
			formAdd.appendChild(select);
			formAdd.appendChild(valid);
			//ajoute du formulaire dans la modale
		} catch (error) {
			console.log('Erreur lors du traitement des travaux dans la galery:', error);
		}
	}

	// execute les fonction quand le token et valide
	function connected() {
		//execute la fonction qui crée la modale
		creatGallery();
		creatAddPicture();
		//
		//modification de la page quand on et connecter
		//
		const login = document.querySelector("#login li");
		const h2Portfolio = portfolio.querySelector('h2');
		const modal = document.getElementById('modal');
		login.innerHTML = 'Logout';
		login.href = '/FrontEnd/index.html';
		const modifier = document.createElement('a');
		
		modifier.href = '#';
		const pen = document.createElement('i')
		pen.className = 'fa fa-pen-to-square'
		pen.textContent = ' modifier';
		modifier.appendChild(pen)
		
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
		
		h2Portfolio.parentNode.insertBefore(modifier, h2Portfolio.nextSibling)
		//A l'interieure de la modal
		const close = document.getElementById('close');
		const addPictureBtn = document.getElementById('AddPictureBtn');
		const containModal = document.getElementById('contain-modal');
		close.addEventListener('click', () => {
			modal.style.display = 'none';
			document.body.style.overflow = 'auto';
		});
		addPictureBtn.addEventListener('click', () => {
			const addPicture = document.getElementById('addPicture');
			addPicture.style.display = 'grid';
			containModal.style.display = 'none';
			//execute la fonction pour afficher l'ajout de nouveaux travaux
		});
	}

	if (token) {
		connected();
	}

	createFilter();
	createWorks();
});
