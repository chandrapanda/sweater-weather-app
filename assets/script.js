//Global variables and HTML Elements
var APIKey = "a97dc7281c9ab7c0ece77353867d800a";
var tagline = document.createElement("p");
tagline.innerHTML =
  "Search for any city's weather! </br> Simply type the name of the city and hit 'SEARCH'. The last five searches will be saved below for your convenience.";
document.querySelector("#city").appendChild(tagline);
var searchHistory = localStorage.getItem('searchHistory');
var parsedSearchHistory;

if (!searchHistory) {
  parsedSearchHistory = [];
} else {
  parsedSearchHistory = JSON.parse(searchHistory);
  displayPreviousCitySearch();
}

//Saves last 5 searches on left side of screen, enabling user to re-select those cities

function savePreviousCitySearch (userInput) {
  userInput = userInput.toLowerCase().trim();
  userInput = userInput.charAt(0).toUpperCase() + userInput.slice(1);
  parsedSearchHistory.forEach((city, index) => {
    if (city === userInput) {
      parsedSearchHistory.splice(index, 1);    
    }
  });

  parsedSearchHistory.push(userInput);
  localStorage.setItem('searchHistory', JSON.stringify(parsedSearchHistory));
}

function displayPreviousCitySearch() {
  document.getElementById('search-history').innerHTML = "";
  //Reversed search display so that most recent search appears on top 
  parsedSearchHistory.slice().reverse().forEach((city) => {
    var previousCityButton = document.createElement('button');
    previousCityButton.classList.add('list-group-item');
    previousCityButton.classList.add('list-group-item-action');
    previousCityButton.innerHTML = city;
    document.getElementById('search-history').appendChild(previousCityButton);
    previousCityButton.addEventListener("click", handleHistoryClick);
  });
}

function handleHistoryClick(event) {
  locationSearch(event.target.innerHTML);
}

//Search button
document.getElementById("city").addEventListener("submit", citySearch);

//Button grabs user input and fetches data from the API
function citySearch(event) {
  event.preventDefault();
  var userInput = document.getElementById("userInput").value;
  locationSearch(userInput);
}

//Calls on Weather API for local city
function locationSearch(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        savePreviousCitySearch(city);
        displayPreviousCitySearch();
        return response.json();
      } else {
        return alert("Error. Please try again.");
      }
    })
    .then(function (data) {
      if (data) {
        findWeather(data);
      }

    });
}

//Finds the current weather using API
function findWeather(locationData) {
  var latitutde = locationData.coord.lat;
  var longitude = locationData.coord.lon;
  var cityName = locationData.name;
  var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitutde}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${APIKey}`;

  fetch(oneCall)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return alert("Error. Please try again.");
      }
    })
    .then(function (weatherData) {
      displayWeather(weatherData);
      displayForecast(weatherData);
    });
  //Displays city name
  document.getElementById("current-city").innerHTML = cityName;
}

//Displays weather on button click
function displayWeather(weatherData) {
  var temperature = weatherData.current.temp.toFixed(0);
  var humidity = weatherData.current.humidity;
  var windSpeed = weatherData.current.wind_speed;
  var uvIndex = weatherData.current.uvi;
  var weatherIcon = weatherData.current.weather[0].icon;

  let locationIcon = document.querySelector(".weather-icon");

  locationIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIcon}.png">`;

  var weatherBox = document.getElementById("weather-info");
  weatherBox.innerHTML = `Temperature = ${temperature}°F </br> Humidity = ${humidity}% </br> Wind Speed = ${windSpeed}MPH </br> UV Index = `;
  var uvBox = document.createElement("span");
  uvBox.classList.add("badge");
  if (uvIndex <= 2) {
    uvBox.classList.add("favorable");
  } else if (uvIndex >= 6) {
    uvBox.classList.add("severe");
  } else {
    uvBox.classList.add("moderate");
  }
  console.log(weatherData);
  weatherBox.appendChild(uvBox).innerHTML = `${uvIndex}`;

  // Dispays current day, date, and time
  var currentDate = moment().format("MMMM Do, YYYY");
  document.getElementById("current-date").innerHTML = currentDate;
}

//Finds and displays forecast for next week
function displayForecast(locate) {
  document.getElementById("forecast-container").innerHTML = "";
  document.getElementById("forecast-title").style.display = "block";
  var latitutde = locate.lat;
  var longitude = locate.lon;
  var endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitutde}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${APIKey}`;

  fetch(endpoint)
    .then(function (response) {
      if (200 !== response.status) {
        alert("Error - please try again.");
        return;
      }

      response.json().then(function (data) {
        data.daily.forEach((value, index) => {
          if (index > 0 && index < 6) {
            var dayName = new Date(value.dt * 1000).toLocaleDateString("en", {
              weekday: "short",
              month: "numeric",
              day: "numeric",
            });
            var forecastCard = document.createElement('div');
            forecastCard.classList.add('card');
            forecastCard.classList.add('forecast');
            forecastCard.classList.add('col-2')
            var icon = value.weather[0].icon;
            var temp = value.temp.day.toFixed(0);
            var wind = value.wind_speed;
            var humidity = value.humidity;
            var fday = `<div class="forecast-day">
                          <h5 class="card-title">${dayName}</h5>
                          <img src="http://openweathermap.org/img/wn/${icon}.png">
                          <div class="forecast-day--temp">Temperature: ${temp}°F</div>
                          <div class="forecast-day--wind">Humidity: ${humidity}%</div>
                          <div class="forecast-day--humidity">Wind Speed: ${wind}MPH</div>
                        </div>`;
            forecastCard.innerHTML = fday;
            document.getElementById('forecast-container').appendChild(forecastCard);

          }
        });
      });
    })
    .catch(function (err) {
      console.log("Fetch Error");
    });
}
