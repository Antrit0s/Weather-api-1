let findInput = document.getElementById('search');
let findBtn = document.querySelector('.find');
let degree = document.querySelector('.degree');
let apiKey = 'b6518ca4d0ef4bb092b184544242506';
let baseUrl = 'https://api.weatherapi.com/v1';
let endpoint = '/current.json';
let data;
let windSpeed = document.querySelector('.windSpeed');
let windDir = document.querySelector('.windDir');
let todayStatus = document.querySelector('.today-forecast .status');
let todayStatusImg = document.querySelector('.today-forecast .status .status-img');
let city = document.getElementById('city');
let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let monthsOfYear = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let todayDay = document.querySelector('.today-forecast .day');
let todayDate = document.querySelector('.today-forecast .date');
let searchInput = document.getElementById('searchInput');

// Event listener for input change
searchInput.addEventListener('input', function() {
    let term = searchInput.value;
    let error = document.getElementById('error');

    if (term === '') {
        error.classList.replace('d-none', 'd-block');
        error.innerHTML = 'Please type a country name';
    } else {
        error.classList.replace('d-block', 'd-none');
        findWeather(term);
    }
});


async function getWeather() {
    try {
        let response = await fetch(`${baseUrl}/forecast.json?key=${apiKey}&q=egypt&days=3&aqi=no&alerts=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data.current);
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function findWeather(term) {
    try {
        let response = await fetch(`${baseUrl}/forecast.json?key=${apiKey}&q=${term}&days=3&aqi=no&alerts=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data.current);
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeatherData(data) {
    city.innerHTML = data.location.country;
    degree.innerHTML = `${data.current.temp_c}<sup>o</sup>C`;
    windSpeed.innerHTML = `<img src="images/icon-wind.png" alt="wind"> ${data.current.wind_kph} km/h`;
    getWindDirection(data.current.wind_dir);
    todayStatus.innerHTML = `${data.current.condition.text} <img class="status-img" src="${data.current.condition.icon}" alt="">`;
    const tDate = new Date(data.current.last_updated);
    let day = tDate.getDay();
    let date = tDate.getDate();
    let month = tDate.getMonth();
    todayDay.innerHTML = daysOfWeek[day];
    todayDate.innerHTML = `${date} ${monthsOfYear[month]}`;
    // Display tomorrow and after tomorrow forecast data
    displayForecast('.tomorrow-forecast', data.forecast.forecastday[1]);
    displayForecast('.aftertomorrow-forecast', data.forecast.forecastday[2]);
}
function displayForecast(selector, forecastData) {
    let forecastElement = document.querySelector(`${selector} .degree`);
    const forecastDate = new Date(forecastData.date); // Parse the date string into a Date object
    const day = forecastDate.getDay(); // Get the day of the week
    const date = forecastDate.getDate(); // Get the day of the month
    const month = forecastDate.getMonth(); // Get the month
    const year = forecastDate.getFullYear(); // Get the year

    forecastElement.innerHTML = `
        <div class="forecast-icon">
            <p>${daysOfWeek[day]}, ${date} ${monthsOfYear[month]} ${year}</p>
            <img class="status-img" src="${forecastData.day.condition.icon}" alt="">
            <p>${forecastData.day.maxtemp_c}<sup>o</sup>C</p>
            <p>${forecastData.day.mintemp_c}<sup>o</sup>C</p>
            <p>${forecastData.day.condition.text}</p>
        </div>`;
}


function getWindDirection(windDirection) {
    let dir;
    windDirection = windDirection.toLowerCase();
    switch (windDirection) {
        case 'n':
            dir = "North";
            break;
        case 's':
            dir = "South";
            break;
        case 'e':
            dir = "East";
            break;
        case 'w':
            dir = "West";
            break;
        case 'nw':
        case 'nnw':
            dir = "North West";
            break;
        case 'sw':
        case 'ssw':
            dir = "South West";
            break;
        case 'se':
        case 'sse':
            dir = "South East";
            break;
        case 'ne':
        case 'nne':
            dir = "North East";
            break;
        default:
            dir = windDirection; // Default to original if no match
            break;
    }
    windDir.innerHTML = `<img src="images/icon-compass.png" alt="compass"> ${dir}`;
}

// Initial call to fetch weather data
getWeather();
