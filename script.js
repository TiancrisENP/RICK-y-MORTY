// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const cardContainer = document.getElementById('card-container');
    const characterFilter = document.getElementById('character-filter');
    
    // Almacenamiento de todos los personajes
    let allCharacters = [];

    // URL base de la API de Rick and Morty
    const API_URL = 'https://rickandmortyapi.com/api/character';

    /**
     * Función para obtener los datos de los personajes desde la API
     */
    async function fetchCharacters() {
        try {
            const response = await fetch(`${API_URL}?page=1`);
            const data = await response.json();
            
            // Solo necesitamos los primeros 20 personajes
            allCharacters = data.results;
            
            // Mostramos los personajes y actualizamos las opciones del filtro
            displayCharacters(allCharacters);
            updateFilterOptions(allCharacters);
            
            // Ocultamos la animación de carga
            document.querySelector('.loading').style.display = 'none';
        } catch (error) {
            console.error('Error fetching characters:', error);
            cardContainer.innerHTML = `
                <div style="text-align: center; color: #FF5252; padding: 30px; grid-column: 1 / -1;">
                    <h2>¡Oh geez! Ha ocurrido un error</h2>
                    <p>No pudimos conectar con la dimensión de Rick and Morty. Intenta de nuevo más tarde.</p>
                </div>
            `;
        }
    }

    /**
     * Función para mostrar los personajes en tarjetas
     * @param {Array} characters - Array de personajes a mostrar
     */
    function displayCharacters(characters) {
        // Limpiamos el contenedor antes de agregar nuevas tarjetas
        cardContainer.innerHTML = '';
        
        // Iteramos sobre cada personaje y creamos su tarjeta
        characters.forEach(character => {
            // Creamos un elemento div para la tarjeta
            const card = document.createElement('div');
            card.className = 'card';
            
            // Determinamos el color del indicador de estado
            let statusClass = 'status-unknown';
            if (character.status === 'Alive') {
                statusClass = 'status-alive';
            } else if (character.status === 'Dead') {
                statusClass = 'status-dead';
            }
            
            // Determinamos la clase para el badge de especie
            let speciesClass = 'badge-unknown';
            if (character.species === 'Human') {
                speciesClass = 'badge-human';
            } else if (character.species === 'Alien') {
                speciesClass = 'badge-alien';
            } else if (character.species.includes('Robot')) {
                speciesClass = 'badge-robot';
            }
            
            // Construimos el HTML interno de la tarjeta
            card.innerHTML = `
                <div class="card-image">
                    <img src="${character.image}" alt="${character.name}">
                </div>
                <div class="card-content">
                    <h2 class="card-title">${character.name}</h2>
                    <div class="card-info">
                        <div class="info-item">
                            <span class="status-indicator ${statusClass}"></span>
                            <span>${character.status} - ${character.species}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Origin:</span>
                            <span>${character.origin.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Last Known Location:</span>
                            <span>${character.location.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Gender:</span>
                            <span>${character.gender}</span>
                        </div>
                    </div>
                    <span class="badge ${speciesClass}">${character.species}</span>
                </div>
            `;
            
            // Agregamos la tarjeta al contenedor
            cardContainer.appendChild(card); 
        });
        
        // Si no hay personajes que mostrar
        if (characters.length === 0) {
            cardContainer.innerHTML = `
                <div style="text-align: center; color: #00ff9d; padding: 30px; grid-column: 1 / -1;">
                    <h2>¡No hay resultados!</h2>
                    <p>Parece que ese personaje se perdió en otra dimensión.</p>
                </div>
            `;
        }
    }

    /**
     * Función para actualizar las opciones del filtro desplegable
     * @param {Array} characters - Array de personajes para crear opciones
     */
    function updateFilterOptions(characters) {
        // Conservamos la opción "Ver todos"
        characterFilter.innerHTML = '<option value="all">Ver todos los personajes</option>';
        
        // Creamos una opción por cada personaje
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent = character.name;
            characterFilter.appendChild(option);
        });
    }

    /**
     * Manejador de eventos para el cambio en el filtro
     */
    characterFilter.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'all') {
            // Mostrar todos los personajes
            displayCharacters(allCharacters);
        } else {
            // Filtrar y mostrar solo el personaje seleccionado
            const filteredCharacter = allCharacters.filter(character => 
                character.id === parseInt(selectedValue)
            );
            displayCharacters(filteredCharacter);
        }
    });

    // Iniciamos la carga de personajes
    fetchCharacters();
});