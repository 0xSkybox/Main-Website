var tomURL = "https://api.tomtom.com/search/2/search/";

var openURL = "http://api.openweathermap.org/data/2.5/forecast";

var openstackURL = "http://172.17.15.141/ubuntu/final.php?method=setWeather";

var loc = "";

function getLocation(searchText) {
    var lon, lat = 0;
    loc = searchText;
    $.ajax({
        url: tomURL + (loc) + '.json?key=' +tomKey,
        method: "GET",
        async: false
    }).done(function(data) {
        console.log(data);
        lon = data.results[0].position.lon;
        lat = data.results[0].position.lat;
        getWeather(lon, lat);
    }).fail(function(error) {
        console.log("error",error.statusText);
    });
}

function getWeather(lon, lat) {
    let weatherJson=$.ajax({
        url: openURL + "?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + openWeatherKey,
        method: "GET",
        async: false
    }).done(function(data) {
        console.log(data);
        var date = [];
        date[0] = data.list[0].dt_txt;

        var high = [];
        high[0] = data.list[0].main.temp;

        var low = [];
        low[0] = data.list[0].main.temp;

        var icon = [];
        icon[0] = data.list[0].weather[0].icon;

        var visibility = [];
        visibility[0] = data.list[0].visibility;

        var humidityDataPoints = [];
        humidityDataPoints[0] = data.list[0].main.humidity;
        var humidity = [];
        var  k = 0;

        var j = 0;
        for(var i = 1; i < 40; i++) {
            if(changesDay(date[j], data.list[i].dt_txt)) {
                j++;
                icon[j] = data.list[i].weather[0].icon;
                date[j] = data.list[i].dt_txt;
                high[j] = data.list[i].main.temp;
                low[j] = data.list[i].main.temp;
                visibility[j] = data.list[i].visibility;
                humidity[j - 1] = findAvgHumidity(humidityDataPoints);
                k = 0;
            }

            humidityDataPoints[k] = data.list[i].main.humidity;

            var temp = data.list[i].main.temp;

            if(high[j] < temp) {
                high[j] = temp;
            } else if (low[j] > temp) {
                low[j] = temp;
            }
        }

        humidity[j] = findAvgHumidity(humidityDataPoints);

        let htmlStr = "";

        for (var i = 0; i < 5; i++) {
            htmlStr += "<div class=\"col border border-dark p-5 rounded\">\n" +
                "            <div id=\"weekday\"" + i + "><strong>" + findDay(date[i].substring(0, 10)) + "</strong> <br> " + date[i].substring(0, 10)+ "</div> <br>\n" +
                "            <div id=\"high\"" + i + ">High: " + high[i] + "</div> <br>\n" +
                "            <div id=\"low\"" + i + ">Low: " + low[i] + "</div> <br>\n" +
                "            <div id=\"visibility\"" + i + ">Visibility: " + visibility[i] + "</div> <br>\n" +
                "            <div id=\"=humidity\"" + i + ">Humidity: " + humidity[i] + "</div> <br>\n" +
                "            <div id=\"forcast\"" + i + "><img src=\"http://openweathermap.org/img/wn/"+ icon[i] + "@2x.png\"/></div> <br>\n" +
                "        </div>";
        }

        $("#weatherTable").html(htmlStr);

    }).fail(function(error) {
        console.log("error",error.statusText);
    });

    $.ajax({
        url: openstackURL,
        data: {
            location: loc,
            weatherJson: weatherJson.responseText,
        },
        async: false,
        method: "POST"
    }).fail(function (error) {
        console.log("error", error.statusText);
        $("#status").prepend("root error " + new Date() + "<br>");
    });

}





function changesDay(oldDate, newDate) {
    o = oldDate.substring(8, 10)
    n = newDate.substring(8, 10)

    return !(o == n);
}

function findDay(date) {
    let d = new Date(date);
    const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
    return weekday[(d.getDay())];
}

function findAvgHumidity(arr) {
    var sum = 0;
    for(var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return (sum/arr.length);
}