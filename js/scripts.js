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

function employeeData() {
  fetchData('https://randomuser.me/api/?results=12').then(data => {
    const employees = data.results;
    console.log(employees);
    employees.map(employee => {
      renderCard(
        employee.picture.large,
        employee.name,
        employee.email,
        employee.location,
        employee.cell,
        employee.dob,
      )
    })
  });
}

function renderModal(picture, name, email, location, cell, dob) {
  const body = document.querySelector('body');
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  body.appendChild(modalContainer);

  // Show state for CA or US, show country for the rest of the world.
  const northAmerica = location.country === 'Canada' || location.country === 'United States';
  const countryState = northAmerica ? location.state : location.country;

  // Render all the internal HTML for the modal.
  modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn">
        <strong>X</strong>
      </button>
      <div class="modal-info-container">
        <img class="modal-img" src="${picture}" alt="profile picture" />
        <h3 id="name" class="modal-name cap">${name}</h3>
        <p class="modal-text">${email}</p>
        <p class="modal-text cap">${location.city}</p>
        <hr>
        <p class="modal-text">${cell}</p>
        <p class="modal-text">${location.street.number} ${location.street.name}, ${location.city}, ${countryState} ${location.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
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
}

/**
 * Build the structure as well as pass in the relevant paramters into their 
 * required places inside of the card.
 */
function renderCard(picture, name, email, location, cell, dob) {
  const gallery = document.querySelector('#gallery');
  const card = document.createElement('div');
  card.className = 'card';
  gallery.appendChild(card);

  // String together the first and last names of the employee.
  const fullName = `${name.first} ${name.last}`;

  // Make sure the employee's date of birth only shows the date.
  const dmyDob = dob.date.split('T')[0];

  // Show state for CA or US, show country for the rest of the world.
  const northAmerica = location.country === 'Canada' || location.country === 'United States';
  const countryState = northAmerica ? location.state : location.country;

  // Render all of the internal HTML to the card.
  card.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${picture}" alt="profile picture" />
    </div>
    <div class="card-info-container">
      <h3 class="card-name cap">${fullName}</h3>
      <p class="card-text">${email}</p>
      <p class="card-text cap">${location.city}, ${countryState}</p>
    </div>
  `;

  /**
   * Trigger the employee modal when the card is clicked.
   * We use `email` as the unique identifier since `id` from the API can be 
   * empty so it's not reliable.
   */
  card.addEventListener('click', (e) => {
    renderModal(picture, fullName, email, location, cell, dmyDob);
  })
}

employeeData();