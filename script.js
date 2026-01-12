async function fetchWeather() {
  const searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  
  // 1. Enter your real API Key inside the quotes
  const apiKey = "e82c5172c2d219d3c38ab3690c8f4b94";

  if (!searchInput) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Step 1: Get Latitude and Longitude from City Name
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `<div><h2>City Not Found</h2><p>Please try again.</p></div>`;
        return;
    }

    const { lat, lon, name } = geoData[0];

    // Step 2: Get Weather Data (units=metric ensures Celsius)
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await weatherRes.json();

    // Step 3: Logic for Icon Glow based on Temperature
    const temp = Math.round(data.main.temp);
    let glowClass = "moderate-glow"; // Default
    
    if (temp >= 25) {
        glowClass = "hot-glow";      // Red glow for 25°C and above
    } else if (temp <= 10) {
        glowClass = "cold-glow";     // Blue glow for 10°C and below
    }

    // Step 4: Get Current Date and Time
    const now = new Date();
    const dateString = now.toLocaleDateString([], { 
        weekday: 'long', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Step 5: Update the UI
    // Note: We use &deg;C to prevent the Â symbol from showing up
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img class="${glowClass}" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" />
      <div>
        <h2>${name}</h2>
        <p style="color: #444; margin-bottom: 5px; font-size: 0.9em;">${dateString}</p>
        <p><strong>Temperature:</strong> ${temp}&deg;C</p>
        <p style="text-transform: capitalize;"><strong>Condition:</strong> ${data.weather[0].description}</p>
      </div>
    `;

    // Clear the search box for the next search
    document.getElementById("search").value = "";

  } catch (err) {
    console.error("Error fetching weather:", err);
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `<div><h2>Error</h2><p>Check your connection or API key.</p></div>`;
  }
}

// ALLOW "ENTER" KEY TO TRIGGER SEARCH
// This stays outside the fetchWeather function
document.getElementById("search").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchWeather();
  }
});