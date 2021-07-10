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
