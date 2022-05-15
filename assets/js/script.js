// Element references used in this code
var apiKeyOpenWeather = '42992f402d6e8d7b9cb59c278ef8f6bb';
var searchButtonEl = document.querySelector("#btnSearch");
var listCitiesEl = document.querySelector("#listCities");
var inputCityEl = document.querySelector("#inputCity");
var cityWeatherEl = document.querySelector("#cityWeather");
var forecastEl = document.querySelector("#forecast");

// This object model will be used to organize data
var local = {
    city : "",
    lat : 0,
    lon : 0,
    currentWeather : null,
    citiesList : []
};

// When a user enters a city name and clicks on Search
searchButtonEl.addEventListener("click", function(event) {
    console.log(inputCityEl.value);
    if (inputCityEl.value) {
        local.city = inputCityEl.value;
        inputCityEl.value = "";
        inputCityEl.focus();
        getLatLon();
    }
});

// When a user presses Enter on the city input text box
inputCityEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        local.city = inputCityEl.value;
        inputCityEl.value = "";
        inputCityEl.focus();
        getLatLon();
    }
})

// When a user clicks on a city button
listCitiesEl.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn")) {
        local.city = event.target.textContent;
        inputCityEl.focus();
        getLatLon();
    }
});

// Maintain city list
var addCity = function(city) {
    let cityIndex = local.citiesList.indexOf(city);

    // If city is already in the list move it to the top
    if (cityIndex>-1) {
        local.citiesList.splice(cityIndex,1);
        local.citiesList.unshift(city);
    } else {
        // If it's a new city remove the last entry and put the new city on the top
        local.citiesList.pop();
        local.citiesList.unshift(city);
    }

    // Write new city list to localStorage
    saveWeather();
    // Update buttons
    makeCityButtons();
};

// Fill current weather element and call function to fill 5-day forecast
var fillCurrentWeather = function() {
    // Clear anything within the current weather box
    cityWeatherEl.innerHTML = "";

    // if there is no weather data add empty h3 and return
    if (!local.currentWeather) {
        let h3 = document.createElement("h3");
        h3.textContent = " ";
        cityWeatherEl.appendChild(h3);
        return;
    }

    // Assemble elements
    let h3 = document.createElement("h3");
    // Current date of city in that city
    let date = moment.unix(local.currentWeather.daily[0].dt).format('MM/DD/YYYY');
    h3.textContent = local.city + " (" + date + ")";
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/"+local.currentWeather.current.weather[0].icon+"@2x.png");
    weatherIcon.setAttribute("height","60px")
    weatherIcon.setAttribute("alt",local.currentWeather.current.weather[0].description);
    h3.appendChild(weatherIcon);
    let temp = document.createElement("p");
    temp.innerHTML = "Temp: " + Math.floor(local.currentWeather.current.temp) + "&deg; F";
    let wind = document.createElement("p");
    wind.textContent = "Wind: " + Math.floor(local.currentWeather.current.wind_speed) + " MPH";
    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + local.currentWeather.current.humidity + " %";
    let uvIndexWrapper = document.createElement("div");
    uvIndexWrapper.setAttribute("class","row justify-content-start align-items-start");
    let uvIndex = document.createElement("div");
    uvIndex.setAttribute("class","col-2");
    uvIndex.textContent = "UV Index: ";
    let uvPill = document.createElement("div");
    uvPill.setAttribute("width","40px");
    uvPill.textContent = Math.floor(local.currentWeather.current.uvi);
    if (local.currentWeather.current.uvi<3) {
        uvPill.setAttribute("class","col-1 p-1 text-center text-light rounded-pill bg-success");
    } else
    if (local.currentWeather.current.uvi<6) {
        uvPill.setAttribute("class","col-1 p-1 text-center rounded-pill bg-warning");
    } else {
        uvPill.setAttribute("class","col-1 p-1 text-center text-light rounded-pill bg-danger");
    }
    uvIndexWrapper.appendChild(uvIndex);
    uvIndexWrapper.appendChild(uvPill);

    // Append elements to existing element
    cityWeatherEl.appendChild(h3);
    cityWeatherEl.appendChild(temp);
    cityWeatherEl.appendChild(wind);
    cityWeatherEl.appendChild(humidity);
    cityWeatherEl.appendChild(uvIndexWrapper);

    // Now fill the 5-day forecast
    fill5DayForecast();
}

// Create and return forecast card element
var makeCard = function(parentEl, day) {
    let card = document.createElement("div");
    card.setAttribute("class","card col-card");

    let cardBody = document.createElement("div");

    let cardDay = document.createElement("h6");
    cardDay.setAttribute("class","card-title");
    cardDay.textContent = moment.unix(day.dt).local().format('dddd');

    let cardTitle = document.createElement("h6");
    cardTitle.setAttribute("class","card-title");
    cardTitle.textContent = moment.unix(day.dt).local().format('MM/DD/YYYY');

    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/"+day.weather[0].icon+"@2x.png");
    weatherIcon.setAttribute("height","50px");
    weatherIcon.setAttribute("alt",day.weather[0].description);

    let temp = document.createElement("p");
    temp.innerHTML = "High: " + Math.floor(day.temp.max) + "&deg; F";

    let wind = document.createElement("p");
    wind.textContent = "Wind: " + Math.floor(day.wind_speed) + " MPH";

    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + day.humidity + " %";

    cardBody.appendChild(cardDay);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(weatherIcon);
    cardBody.appendChild(temp);
    cardBody.appendChild(wind);
    cardBody.appendChild(humidity);
    
    card.appendChild(cardBody);

    return card;
}

// Clear forecast area, create row for title, create row for each day card forecast
var fill5DayForecast = function() {
    // Clear the 5-day forecast
    forecastEl.innerHTML = "";

    // Create elements of the 5-day forecast
    let row = document.createElement("div");
    row.setAttribute("class","row");

    let title = document.createElement("h4");
    title.textContent = "5-Day Forecast:";
    title.setAttribute("class","col-12");

    let days = document.createElement("div");
    days.setAttribute("class","row justify-content-between");

    // Iterate over the next 5 days, make cards for each day
    for (i=1;i<6;i++) {
        days.appendChild(makeCard(days,local.currentWeather.daily[i]));
    }

    row.appendChild(title);
    row.appendChild(days);
    forecastEl.appendChild(row);
}

// This uses the openweathermap geocoding API to get lat and lon coordinates for city name
// *** This is the entry point where localStorage has a city or the city has changed
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
                if (data.length>0) {
                    // Store the city returned from the API call
                    local.lat = data[0].lat;
                    local.lon = data[0].lon;
                    local.city = data[0].name;
                    addCity(local.city);
                    getWeather();
                }
            }
            );
        } else {
            // Error handling?
        }
    });    
}

// Weather API call, gets current weather and forecast
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
                saveWeather();
                fillCurrentWeather();
            });
        } else {
            local.currentWeather = "";
        }
    });    
}

// Dynamically create buttons for list of cities
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

// On page load or reload, load data from localStorage
// If it's missing, or over 5 minutes old, load from API calls
var loadWeather = function() {
    local = JSON.parse(localStorage.getItem("weather"));
    // If it's missing initialize the local object and do API calls
    if (!local) {
        local = {
            city : "",
            lat : 0,
            lon : 0,
            currentWeather : null,
            citiesList : ["Austin","Chicago","New York","Orlando","San Francisco","Seattle","Denver","Atlanta"]
        };
        findCurrentCity();
    } else {
        // If there is a localStorage object, check how old the data is
        console.log("Current Time: "+moment().format("hh:mm:ss a"));
        console.log("Last API Call: "+moment.unix(local.currentWeather.current.dt).local().format("hh:mm:ss a"));
        let currentTime = moment();
        let lastUpdated = moment.unix(local.currentWeather.current.dt).add(5,"minute");
        // If weather API has not been refreshed in over 5 minutes, call the API again
        if (currentTime > lastUpdated) {
            getWeather();
        } else {
            // Otherwise skip the API and load from localStorage
            fillCurrentWeather();
        }
    }
    makeCityButtons();
    inputCityEl.focus();
}

// Save local object including weather to localStorage
var saveWeather = function() {
    localStorage.setItem("weather",JSON.stringify(local));
}

// Get the current city by visitor's IP address
// *** This is the entry point where there is no localStorage city defined
var findCurrentCity = function() {
    // This is free and doesn't require an API key
    let apiUrl = "https://ip-api.com/json/";

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
                    local.city = "New York";
                    getLatLon();
            });
        } else {
            local.city = "New York";
            getLatLon();
        }
    })
    .catch(function(error) {
        local.city = "New York";
        getLatLon();
    });
};

loadWeather();
