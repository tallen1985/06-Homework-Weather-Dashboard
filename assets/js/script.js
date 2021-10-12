const searchHistoryUL = document.getElementById('searchHistoryUL');
const searchDIV = document.getElementById('searchDIV')
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const locationName = document.getElementById('locationName');
const weatherDIV = document.getElementById('weatherDIV')
const forecastDIV = document.getElementById('forecastDIV');
const todaysDate = document.getElementById('todaysDate')
const currentTemp = document.getElementById('currentTemp');
const currentIcon = document.getElementById('currentIcon');
const currentWind = document.getElementById('currentWind');
const currentHumidity = document.getElementById('currentHumidity');
const currentUV = document.getElementById('currentUV');

const today = moment();
const apiKey = '1a306f57eaa04b66a65190330210107';
let weatherLocation = '33912';

let searchItems = [];
const maxHistoryItems = 5;

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
        newEl.classList = "searchItem btn-info";
        newEl.textContent = items[x];
        searchHistoryUL.appendChild(newEl);
    }
    searchInput.value = '';
};


searchForm.addEventListener('submit', function(e) {
    searchDIV.classList = "";
    weatherDIV.style.display = 'block';
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

searchHistoryUL.addEventListener('click', function(e) {
    if (e.target.matches('.searchItem')) {
        e.preventDefault();
        searchInput.value = e.target.textContent;
        searchButton.click();
    }
})

function currentWeather(location) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}}&aqi=no`)
        .then(response => response.json())
        .then(weather => {
            locationName.textContent = weather.location.name + 
            ', ' + weather.location.region;
            todaysDate.textContent = today.format('MM/DD/YYYY')
            currentHumidity.textContent = weather.current.humidity;
            currentWind.textContent = weather.current.wind_mph;
            currentTemp.textContent = weather.current.temp_f;
            UVColor(weather.current.uv);
            currentIcon.src = "http:" + weather.current.condition.icon;
            console.log(weather)
        });
}

function UVColor(index) {
    let color = '';
    if(index <= 2) {
        color = "green";
    } else if (index <= 5) {
        color = 'yellow';
    } else if (index <= 7) {
        color = 'orange';
    } else if (index <= 10) {
        color = 'red'
    } else {
        color = 'violet'
    }
    currentUV.style.backgroundColor = color;
    currentUV.textContent = index;
}

function getForecast(location) {
    forecastUL.innerHTML = '';
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