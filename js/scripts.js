/**
 * A function for getting the resource from the API and checking its status.
 * @param {string} url - URL to the API endpoint.
 */

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('Looks like there was a problem', error));
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/**
 * Pull 12 users from the Random User API and limit them to only a handful of 
 * English speaking countries for the sakes of the search.
 */
function employees() {
  fetchData(`https://randomuser.me/api/?results=12&nat=au,ca,gb,ie,nz,us`).then(data => {
    const employees = data.results;
    renderSearch(employees);
  });
}

function renderModalInfo(employee) {
  // Show state for CA or US, show country for the rest of the world.
  const northAmerica = employee.location.country === 'Canada' || employee.location.country === 'United States';
  const countryState = northAmerica ? employee.location.state : employee.location.country;

  // Make sure the employee's date of birth only shows the date.
  const dmyDob = employee.dob.date.split('T')[0];

  return `
    <img class="modal-img" src="${employee.picture.large}" alt="profile picture" />
    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
    <p class="modal-text">${employee.email}</p>
    <p class="modal-text cap">${employee.location.city}</p>
    <hr>
    <p class="modal-text">${employee.cell}</p>
    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${countryState} ${employee.location.postcode}</p>
    <p class="modal-text">Birthday: ${dmyDob}</p>
  `;
}

function renderModal(employees, index) {
  let currentIndex = index;
  const body = document.querySelector('body');
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  body.appendChild(modalContainer);

  // Render all the internal HTML for the modal.
  modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn">
        <strong>X</strong>
      </button>
      <div class="modal-info-container">
        ${renderModalInfo(employees[index])}
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>
  `;

  /**
   * Close the modal and remove it from the DOM when the cross is clicked.
   */
  const closeModal = document.querySelector('.modal-close-btn');
  closeModal.addEventListener('click', (e) => {
    body.removeChild(modalContainer);
  });

  /**
   * Navigate to the previous employee on the list when the "Prev" button is 
   * clicked.
   */
  const prevEmployee = document.querySelector('.modal-prev');
  prevEmployee.addEventListener('click', (e) => {
    if (currentIndex > 1) {
      const modalInfo = document.querySelector('.modal-info-container');
      modalInfo.innerHTML = renderModalInfo(employees[currentIndex -= 1]);
    }
  });

  /**
   * Navigate to the next employee on the list when the "Next" button is 
   * clicked. 
   */
  const nextEmployee = document.querySelector('.modal-next');
  nextEmployee.addEventListener('click', (e) => {
    if (currentIndex < (employees.length - 1)) {
      const modalInfo = document.querySelector('.modal-info-container');
      modalInfo.innerHTML = renderModalInfo(employees[currentIndex += 1]);
    }
  });
}

/**
 * Build the structure as well as pass in the relevant paramters into their 
 * required places inside of the card.
 */
function renderCards(employees) {
  const gallery = document.querySelector('#gallery');
  gallery.innerHTML = '';
  employees.map((employee, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    gallery.appendChild(card);

    // Show state for CA or US, show country for the rest of the world.
    const northAmerica = employee.location.country === 'Canada' || employee.location.country === 'United States';
    const countryState = northAmerica ? employee.location.state : employee.location.country;

    // Render all of the internal HTML to the card.
    card.innerHTML = `
      <div class="card-img-container">
        <img class="card-img" src="${employee.picture.large}" alt="profile picture" />
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text">${employee.email}</p>
        <p class="card-text cap">${employee.location.city}, ${countryState}</p>
      </div>
    `;

    // Trigger the employee modal when the card is clicked.
    card.addEventListener('click', (e) => {
      renderModal(employees, i);
    })
  })
}

function renderSearch(employees) {
  const searchContainer = document.querySelector('.search-container');
  searchContainer.innerHTML = `
    <form action="#" method="GET">
      <input type="search" id="search-input" class="search-input" placeholder="Search..." />
      <input type="submit" value="🔍" id="search-submit" class="search-submit" />
    </form>
  `;
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-submit');

  /**
   * Render the initial page of employees.
   */
  renderCards(employees);

  searchButton.addEventListener('click', (e) => {
    filteredEmployees = employees.filter(employee => {
      const fullName = `${employee.name.first} ${employee.name.last}`.toLowerCase();
      return fullName.indexOf(searchInput.value.toLowerCase()) !== -1;
    });
    renderCards(filteredEmployees);
  })
}

employees();