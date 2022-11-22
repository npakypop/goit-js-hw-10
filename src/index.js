import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');
const inputRef = document.querySelector('#search-box');
inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    countryListRef.innerHTML = '';
    fetchCountries(event.target.value.trim())
    .then(data => {
        if (data.length >= 10) {
             Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (data.length > 1 && data.length < 10) {
            countryInfoRef.innerHTML = '';
            creatList(data);
        } else if (data.length === 1) { 
            creatCard(data[0]);
        }
    })     
    .catch(err => { 
        if (err.message === '404') { 
             Notify.failure('раздуплись, ГОЛОВА, и введи правильное название страны');
        }
    })
}

function creatList(list) { 
     for (const el of list) {      
        const listItem = document.createElement('li');
        countryListRef.append(listItem);
        listItem.classList.add('item_sm');
        listItem.innerHTML = `<img src='${el.flags.png}' width='50'></img><span>${el.name.official}</span>`;
    }
}

function creatCard(el) { 
    countryInfoRef.innerHTML = `
      <div class="headline"><img class="flag_lg" src="${el.flags.png}" alt="${el.name.official}" width=90 height=60><h1 class="country_name">${el.name.official}</h1></div>
      <p class="descrip">Capital: <span class="value">${el.capital}</span></p>
      <p class="descrip">Population: <span class="value">${el.population}</span></p>
      <p class="descrip">Languages: <span class="value">${Object.values(el.languages)}</span></p>
    `;
}