//Global variables
var APIKey = "a97dc7281c9ab7c0ece77353867d800a";

//Dispays current day, date, and time
// window.setInterval(function () {
//   document
//     .getElementById("default-weather")
//     .html(moment().format("dddd, MMM DD yyyy H:mm:ss"));
// }, 1000);

document.getElementById("city").addEventListener("submit", handleFormSubmit);

//Finds location
function handleFormSubmit(event) {
  event.preventDefault();

  //grab the value of the users input
  var userInput = document.getElementById("userInput").value;

  //fetch the data from the api
  locationSearch(userInput);
}

//TODO: Call on Weather API for local city
function locationSearch(city) {

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return alert("Error. Please try again.");
      }
    })
    .then(function(data){
        findWeather(data);
    });
}

//TODO: Create a function to find the current weather using API
function findWeather(coordinates) {
    var latitutde = coordinates.coord.lat;
    var longitude = coordinates.coord.lon;
    var cityName = coordinates.name;
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitutde + "&lon=" + longitude + "&exclude=minutely,hourly&units=imperial&appid=" + APIKey;

    fetch(oneCall)
    .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return alert("Error. Please try again.");
        }
      })
      .then(function(data){
          //loop through forecast 1-6
          //pass icon via URL 
          console.log(data.current, cityName);
      });

}

// //TODO: Create a function to display weather after button click
// function displayWeather(); {
//     if (!enteredCity) {
//         alert("Please enter a valid city name");
//       } else {
//         displayWeather();
//       }
//     };

//Fetch the geo data (lat, lon)
// q = Name of the city

// limit = 5 (optional)

// appid = your custom API key

//Fetch the one call weather data

// lat

// lon

// appid

// units = imperial/metric

// exclude = minutely, hourly

// Print / render the weater data to the page

// From the <form> element, listen to the "submit" OR
// From the <button> element, listen to the "click"

// Select <input>, get its value, and provide it to the geo API

// Ffrom the <button> container element, listen to the <button> "click"

// Get the city from the button's data attribute
