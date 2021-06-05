'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  //countriesContainer.style.opacity = 1;
};

/////////////////////////////////
// Get geolocation of the user
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
getPosition().then(pos => console.log(pos));

function whereAmI() {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })

    .then(res => {
      console.log(res);

      if (!res.ok)
        throw new Error(
          `You made more than 3 requests per second. ${res.status}`
        );

      return res.json();
    })

    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      const country = data.country;

      return fetch(`https://restcountries.eu/rest/v2/name/${country}`);
      // console.log(request);
      // console.log(country);
    })
    .then(res => {
      console.log(res);
      if (!res.ok) {
        throw new Error(`Country not found (${res.status})`);
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      return renderCountry(data[0]);
    })
    .catch(err => console.error(err.message))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

//whereAmI(52.508, 13.381);

btn.addEventListener('click', function () {
  // whereAmI(52.508, 13.381);
  whereAmI();
});
