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

        // get 5-day forecast
        let forecastQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=current,minutely,hourly&appid=da468ab9a905baca6e0c24b0bea30953`;
        // ajax for forecast cards
        $.ajax({
             url: forecastQueryUrl,
             method: "GET"
        })
            .then(function (response) {
                $(".card-day").each(function (day) {
                    day = day + 1;
                    // date
                    let cardDateMoment = moment.unix(response.daily[day].dt).format("MM/DD/YYYY");
                    // icon 
                    let weatherCardIcon = response.daily[day].weather[0].icon;
                    let weatherCardIconURL = `https://openweathermap.org/img/wn/${weatherCardIcon}.png`;
                    let weatherCardIconDesc = response.daily[day].weather[0].description;
                    // convert temp to fahrenheit
                    let cardTempF = (response.daily[day].temp.day - 273.15) * 1.80 + 32;
                    // humidity
                    let cardHumidity = response.daily[day].humidity;
                    // fill out cards
                    $($(this)[0].children[0].children[0]).text(cardDateMoment);
                    $($(this)[0].children[0].children[1].children[0]).attr("src", weatherCardIconURL).attr("alt", `${weatherCardIconDesc}`).attr("title", `${weatherCardIconDesc}`);
                    $($(this)[0].children[0].children[2]).text(`Temp: ${cardTempF.toFixed(2)} ℉`);
                    $($(this)[0].children[0].children[3]).text(`Humidity: ${cardHumidity}%`);
                });
            })
    };

    // store and display past searches
    function storeSearchTerms(searchedCity) {
        localStorage.setItem("city" + localStorage.length, searchedCity);
    }
    
    let storedSearchList = "";
    function displaySearchTerms() {
        // one button per searched city
        searchHistory.empty();
        for (let i = 0; i < localStorage.length; i++) {
            storedSearchList = localStorage.getItem("city" + i);
            let searchHistoryBtn = $("<button>").text(storedSearchList).addClass("btn btn-primary button-srch m-2").attr("type", "submit");
            searchHistory.append(searchHistoryBtn);
        }
    }

    // event listeners
    // search button functionality
    searchBtn.on("click", function (event) {
        event.preventDefault();
        storeSearchTerms(searchTerm[0].value.trim());
        displaySearchTerms();

        let queryURL = createQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(updateCurrentWeather);
    });

    // past search buttons
    $(document).on("click", ".button-srch", function () {

        let pastCity = $(this).text();

        storeSearchTerms(pastCity);

        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?appid=da468ab9a905baca6e0c24b0bea30953&q=${pastCity}`,
            method: "GET"
        })
            .then(updateCurrentWeather);
    });
});
