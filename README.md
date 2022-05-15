# 06-Server-Side-APIs

## Description
Week 6 of Columbia Engineering Coding Bootcamp challenges us to make a "Weather Dashboard." The purpose is to explore the use of Server Side APIs like the openweathermap.org API.

For a demonstration please browse to my Github pages:
[https://chrispobrien.github.io/06-Server-Side-APIs/]

Objectives include:

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

* I added a feature to look up the visitor's city by IP address if they are a new visitor (ip-api.com).
* Data is persistent using the localStorage API
    * Last displayed city will show again upon re-visit
    * The city button list will be saved
    * Weather API data is cached in localStorage and rate-limited to once every 5 minutes. I did this to be kind to the API provider, to improve performance, and in development my browser refreshes automatically.
* An interesting limitation in the openweathermap.org API is that UV Index is available only through their "onecall" API but it doesn't allow lookup by city name, only by latitude and longitude. The solution is to call their geocoding API first, store lat and lon coordinates, and then make a onecall API call.
* Another challenge is to convert the Unix style date to a useable format, I used moment.js, and the dates returned from openweathermap.org, in the forecast section, are dates and times local to the city. This application does not display the time, but it does show the date, and that is a local date to the city.
* I also added the day of the week to the 5-day forecast because it is confusing without it.
* I used plain JavaScript instead of jQuery.
* The colors are a bit different.

## Installation

Using git, issue the command:

```sh
git clone https://github.com/chrispobrien/06-Server-Side-APIs.git
```
This creates the folder 06-Server-Side-APIs within which you will find the project files.  The images folder contains the png supplied by the Bootcamp to demonstrate the intended design of this project.

[![Weather Dashboard Design][demo]](./assets/images/06-server-side-apis-homework-demo.png)

## Usage

Since this is a classroom exercise, I would recommend simply opening the index.html file in a browser on your local machine.

[![Third Party APIs][screenshot]](./assets/images/05-third-party-apis.png)

## Credits

Specifications and demo from Columbia Coding Bootcamp/Trilogy. All other content are my own solution to this problem. There may be starter bits, like HTML and CSS, but they were not available when I had time to write this, so I did not use them.

## License

© 2022 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.


<!-- MARKDOWN LINKS & IMAGES -->
[demo]: ./assets/images/06-server-side-apis-homework-demo.png
[screenshot]: ./assets/images/06-server-side-apis.png
