const apiKey = "1b42f502038c4250afa85400240409";

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
            renderCharts(data.forecast.forecastday);
        })
        .catch(error => {
            alert("City not found. Please try again.");
        });
}

function displayCurrentWeather(data) {
    const currentWeather = data.current;
    const location = data.location;
    
    const weatherHtml = `
        <h2>Current Weather in ${location.name}, ${location.country}</h2>
        <img src="http:${currentWeather.condition.icon}" alt="${currentWeather.condition.text}">
        <p><strong>Condition:</strong> ${currentWeather.condition.text}</p>
        <p><strong>Temperature:</strong> ${currentWeather.temp_c}°C</p>
        <p><strong>Humidity:</strong> ${currentWeather.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${currentWeather.wind_kph} kph</p>
        <p><strong>Date and Time:</strong> ${location.localtime}</p>
    `;
    document.getElementById('currentWeather').innerHTML = weatherHtml;
}

function displayForecast(data) {
    const forecast = data.forecast.forecastday;
    let forecastHtml = `<h2>7-Day Forecast</h2>`;
    
    forecast.forEach(day => {
        forecastHtml += `
            <div class="forecast-day">
                <p><strong>${day.date}</strong></p>
                <img src="http:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>${day.day.condition.text}</p>
                <p><strong>Temp:</strong> ${day.day.avgtemp_c}°C</p>
                <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
            </div>
        `;
    });
    
    document.getElementById('forecast').innerHTML = forecastHtml;
}

function renderCharts(forecast) {
    const labels = forecast.map(day => day.date);
    const temps = forecast.map(day => day.day.avgtemp_c);
    const humidity = forecast.map(day => day.day.avghumidity);

    // Temperature Chart
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Temperature (°C)',
                data: temps,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '7-Day Temperature Forecast'
                }
            }
        }
    });

    // Humidity Chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Humidity (%)',
                data: humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '7-Day Humidity Forecast'
                }
            }
        }
    });
}
