var openstackURL = "http://172.17.15.141/ubuntu/final.php?method=getWeather";

getData(new Date(), 1);

function changesDay(oldDate, newDate) {

}

function getData(dateSelected, lineCount) {
    console.log(dateSelected);
    console.log(lineCount)
    $.ajax({
        url: openstackURL + "&date=" + dateSelected,
        method: "GET",
        async: false,
    }).done(function(data) {
        console.log(data);

        dates = [];
        locations = [];
        lats = [];
        lons = [];
        json = [];

        if(data.result.length > 0) {
            for(var i = 0; i < data.result.length; i++) {
                dates[i] = data.result[i].DateTime;
                console.log(dates[i]);
                locations[i] = data.result[i].Location;
                console.log(locations[i]);

                // lats[i] = data.results[i].weatherJson.data.city.coord.lat;
                // lons[i] = data.results[i].weatherJson.data.city.coord.lon;
                // console.log(lats[i])
                // console.log(lons[i])

                json[i] = data.result[i].WeatherJson;
            }
        } else {
            $("#display").html("<h2>No Results</h2>");
        }

        let htmlStr = "";

        for (var i = 0; i < dates.length; i++) {
            htmlStr += "<div class=\"col bg-dark text-white rounded\">\n" +
                "                <h2>" + locations[i] +"<br>Cords: "+ lats[i] + ", " + lons[i] + "</h2>\n" +
                "                <h2>" + dates[i] + "</h2>\n" +
                "                <p>" + getString(json[i], lineCount) + "</p>\n" +
                "            </div>";
        }

        $("#display").html(htmlStr);

    }).fail(function (error) {
        console.log("error", error.statusText);
    });
}

function getString(json, lineCount) {
    let str = "";

    numberOfChars = 90 * lineCount;
    for(var i = 0; i < numberOfChars; i++) {
        str += json.charAt(i);
    }

    return str;
}