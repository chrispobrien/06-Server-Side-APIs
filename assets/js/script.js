var apiKeyOpenWeather = '42992f402d6e8d7b9cb59c278ef8f6bb';
var searchButtonEl = document.querySelector("#btnSearch");
var listCitiesEl = document.querySelector("#listCities");
var inputCityEl = document.querySelector("#inputCity");
var cityWeatherEl = document.querySelector("#cityWeather");

// This object contains persistent data
var local = {
    city : "",
    lat : 0,
    lon : 0,
    currentWeather : null,
    citiesList : []
};

searchButtonEl.addEventListener("click", function(event) {

});

listCitiesEl.addEventListener("click", function(event) {

});

var fillCurrentWeather = function() {
    cityWeatherEl.innerHTML = "";
    let h3 = document.createElement("h3");
    let date = moment.unix(local.currentWeather.current.dt).local().format('MM/DD/YYYY');
    h3.textContent = local.city + " (" + date + ")";
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/"+local.currentWeather.icon+"@2x.png");
    h3.appendChild(weatherIcon);
    let temp = document.createElement("p");
    temp.textContent = "Temp: " + local.currentWeather.current.temp;
    let wind = document.createElement("p");
    wind.textContent = "Wind: " + local.currentWeather.current.wind_speed + " MPH";
    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + local.currentWeather.current.humidity + " %";
    let uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: " + local.currentWeather.current.uvi;
    cityWeatherEl.appendChild(h3);
    cityWeatherEl.appendChild(temp);
    cityWeatherEl.appendChild(wind);
    cityWeatherEl.appendChild(humidity);
    cityWeatherEl.appendChild(uvIndex);
}

// This uses the openweathermap geocoding API to get lat and lon coordinates for city name
var getLatLon = function() {
    let apiURL = "https://api.openweathermap.org/geo/1.0/direct?q="
     + local.city
     + "&limit=1"
     + "&appid="
     + apiKeyOpenWeather;

    // An API call without parameters will use the visitor's current IP address
    fetch(apiURL).then(function(response) {
        // If response is ok and...
        if (response.ok) {
            response.json().then(function(data) {
                // Store the city returned from the API call
                local.lat = data[0].lat;
                local.lon = data[0].lon;
                local.city = data[0].name;
                getWeather();
            });
        } else {
            // Error?
        }
    });    
}

var getWeather = function() {
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat="
     + local.lat
     + "&lon="
     + local.lon
     + "&units=imperial"
     + "&appid="
     + apiKeyOpenWeather;

    // An API call without parameters will use the visitor's current IP address
    fetch(apiURL).then(function(response) {
        // If response is ok and...
        if (response.ok) {
            response.json().then(function(data) {
                // Store the current weather
                local.currentWeather = data;
                fillCurrentWeather();
            });
        } else {
            local.currentWeather = "";
        }
    });    
}


var makeCityButtons = function() {
    // Clear city buttons
    listCitiesEl.innerHTML = "";

    // Iterate over list of cities and create a button for it
    for (i=0;i<local.citiesList.length;i++) {
        let newButton = document.createElement("button");
        newButton.setAttribute("class","form-control btn btn-secondary btn-sm mt-1 mb-1");
        newButton.textContent = local.citiesList[i];
        listCitiesEl.appendChild(newButton);
    }
}

// Load cities list from localStorage
var loadCitiesList = function() {
    local.citiesList = JSON.parse(localStorage.getItem("cities"));
    // If it's missing load a default list and save it to localStorage
    if (!local.citiesList) {
        local.citiesList = ["Austin","Chicago","New York","Orlando","San Francisco","Seattle","Denver","Atlanta"];
        saveCitiesList();
    }
}

// Save current cities list to localStorage
var saveCitiesList = function() {
    local.localStorage.setItem("cities",JSON.stringify(citiesList));
}

// Get the current city by visitor's IP address
var findCurrentCity = function() {
    // This is free and doesn't require an API key
    let apiUrl = "http://ip-api.com/json/";

    // An API call without parameters will use the visitor's current IP address
    fetch(apiUrl).then(function(response) {
        // If response is ok and...
        if (response.ok) {
            response.json().then(function(data) {
                // If response contains status "success"
                if (data.status === "success") {
                    // Store the city returned from the API call
                    local.city = data.city;
                    getLatLon();
                }
                else
                    local.city = "";
            });
        } else {
            local.city = "";
        }
    });
};

loadCitiesList();
makeCityButtons();
//findCurrentCity();
inputCityEl.focus();