const searchHistoryUL = document.getElementById('searchHistoryUL');
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const locationName = document.getElementById('locationName');
const forecastDIV = document.getElementById('forecastDIV');

const apiKey = '1a306f57eaa04b66a65190330210107';
let weatherLocation = '33912';

let searchItems = [];
const maxHistoryItems = 10;

function initLocalStorage(){
    if (localStorage.getItem('storedSearches')){
        searchItems = JSON.parse(localStorage.getItem('storedSearches'));
        for (let x = 0; x < searchItems.length; x++) {
            createStorageNodes(searchItems);
        }
    }
}

function createStorageNodes(items) {
    searchHistoryUL.innerHTML = '';
    for (let x = 0; x < items.length; x++){
        const newEl = document.createElement('li');
        newEl.classList = "searchItem";
        newEl.textContent = items[x];
        searchHistoryUL.appendChild(newEl);
    }
    searchInput.value = '';
};

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = searchInput.value;
    if(input.length > 0) {
        currentWeather(input);
        getForecast(input)
        searchItems.unshift(input);
        if(searchItems.length > maxHistoryItems) {
            searchItems.pop();
        }
        createStorageNodes(searchItems);
        searchButton.blur();
        localStorage.setItem('storedSearches', JSON.stringify(searchItems));
    }
})

function currentWeather(location) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}}&aqi=no`)
        .then(response => response.json())
        .then(weather => {
            locationName.textContent = weather.location.name;
        });
}

const getForecast = (location) => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`)
        .then(response => response.json())
        .then(weather => {
            for(var x = 0; x < 3; x++){
                const forecastDay = weather.forecast.forecastday[x];
                const element = document.createElement('div')
                    element.className = "forecastDay dayCard";
                    element.innerHTML = `
                                            <h4>${forecastDay.date}</h4>
                                    
                                            <p>${forecastDay.day.condition.text}</p>
                                            <p>${forecastDay.day.maxtemp_f} &#176F <br> ${forecastDay.day.mintemp_f} &#176F</p>
                                        `
                forecastUL.appendChild(element);
            }
        });

}

initLocalStorage();