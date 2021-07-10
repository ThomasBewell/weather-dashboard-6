$(document).ready(function () {
    // search section variables
    const searchBtn = $("#button-search");
    let searchTerm = $("#search-term");
    let searchHistory = $("#search-history");
    let searchCity = "";
    const clearBtn = $("#clear-search");

    // current weather variables
    const cityHeader = $("#city-date");
    const cityIcon = $("#weather-icon-current");
    const cityTemp = $("#city-temp");
    const cityHumidity = $("#city-humidity");
    const cityWindSpeed = $("#city-wind-speed");
    const cityUVIndex = $("#city-uv-index");

    // today's date
    const todaysDate = moment();

    // create query URL
    function createQueryURL() {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        let queryParams = { "APPID": "da468ab9a905baca6e0c24b0bea30953" };

        queryParams.q = searchTerm
            .val()
            .trim();

        return queryURL + $.param(queryParams);
    }

    // get the current weather
    function updateCurrentWeather(response) {
        // get weather icon
        let weatherIcon = response.weather[0].icon;
        let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        let weatherIconDescription = response.weather[0].description;
        
        // convert temp to fahrenheit
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        
        // update weather
        searchCity = response.name;
        cityHeader.text(`${searchCity} (${todaysDate.format("MM/DD/YYYY")}) `);
        cityHeader.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescription}`).attr("title", `${weatherIconDescription}`));
        cityTemp.text(`Temperature: ${tempF.toFixed(2)} ℉`);
        cityHumidity.text(`Humidity: ${response.main.humidity}%`);
        cityWindSpeed.text(`Wind Speed: ${response.wind.speed} MPH`);

        // get uv index
        let currentLat = response.coord.lat;
        let currentLong = response.coord.lon;
        let uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=da468ab9a905baca6e0c24b0bea30953&lat=${currentLat}&lon=${currentLong}`;
        // ajax for current uv index
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        })
            .then(function (response) {
                let uvValue = response.value;
                cityUVIndex.text(`UV Index: `);
                let uvSpan = $("<span>").text(uvValue).addClass("p-2");

                // Add colors to uv value
                if (uvValue >= 0 && uvValue < 3) {
                    uvSpan.addClass("uv-green");
                }
                else if (uvValue >= 3 && uvValue < 6) {
                    uvSpan.addClass("uv-yellow");
                }
                else if (uvValue >= 6 && uvValue < 8) {
                    uvSpan.addClass("uv-orange");
                }
                else if (uvValue >= 8 && uvValue < 11) {
                    uvSpan.addClass("uv-red");
                }
                else if (uvValue >= 11) {
                    uvSpan.addClass("uv-purple");
                }

                cityUVIndex.append(uvSpan);
            });
