var output = []; //This is the output array holding an array of objects
var influenceRating = []; //These are the influence ratings
var ID = 10112025;
var authentication = undefined;
var done = 0; //the number done processing AJAX
var path; //used for Google Maps polyline
var number;

/* This method resets everything */
function ajaxRequest(){ 
    done = 0;
    update();
    output = [];
    influenceRating = [];
    $('.determinate').css('width', '0%');
}

/* This method calls all of the other methods to repopulate the table */
function update(){
    updateAccess();
    getLeaderboard();
}

/* This method reassigns the access ID and authentication */
function updateAccess(){
    $('.determinate').css('width', '10%');
    if (document.getElementById('segmentID').value != ""){
        ID = document.getElementById('segmentID').value;
    }
    if (document.getElementById('token').value != ""){
        authentication = document.getElementById('token').value;
        if (authentication == "")
            authentication = undefined;
    }
}

/* This method gets the leaderboard */
function getLeaderboard(){
    $.getJSON("./get/leaderboard?segmentID=" + ID + (authentication == undefined ? "" : ("&accessToken=" + authentication)) + "", function (data) {
        var start = data.entries[0].rank;
        for(var x = 0; x < data.entries.length; x++){
            output.push({
                rank: (start + x) + getFinisherSuffix((start + x) +""),
                name: data.entries[x].athlete_name,
                date: data.entries[x].start_date.substring(0, 10),
                formattedTime: data.entries[x].start_date,
                averageSpeed: getAverageSpeed(data.entries[x].elapsed_time, data.entries[x].distance)
            });
        }
        $('.determinate').css('width', '20%');
        getLocation(); 
    });
}

/* This method gets the path as a summary polyline and basic geographic location */
function getLocation(){
    $.getJSON("./get/location?segmentID=" + ID + (authentication == undefined ? ("") : ("&accessToken=" + authentication)), function (data) {
        latitude = splitIntoTokens(data.start_latlng)[0];
        longitude = splitIntoTokens(data.start_latlng)[1];
        path = data.map; //splitIntoTokens(data.start_latlng)[0], splitIntoTokens(data.start_latlng)[1], data.map
        initialize();

        for(var x = 0; x < output.length; x++){
            output[x].startCoordinate = splitIntoTokens(data.start_latlng);
            output[x].endCoordinate = splitIntoTokens(data.end_latlng);
            output[x].elevation = data.average_grade;
        }
        $('.determinate').css('width', '30%');
        getWeatherInformation();
    });
}

/* This method calculates the basic influence rating through manipulation of vectors */
function calculateInfluenceRating(){
    for(var q = 0; q < output.length; q++){
        var wind = {}; //calculate the vector here? degrees -> vector?
        wind.lat1 = 0;
        wind.long1 = 0;
        wind.lat2 = Math.cos(2 * Math.PI - (output[q].windBearing * Math.PI/180)-Math.PI/2);
        wind.long2 = Math.sin(2 * Math.PI - (output[q].windBearing * Math.PI/180)-Math.PI/2);
        wind.id = q;
        wind.speed = output[q].windSpeed;

        var effort = {}; //this is the effort object with all valid fields
        effort.lat1 = output[q].startCoordinate[0];
        effort.long1 = output[q].startCoordinate[1];
        effort.lat2 = output[q].endCoordinate[0];
        effort.long2 = output[q].endCoordinate[1];
        effort.speed = output[q].averageSpeed;

        influenceRating.push(getCorrelation(wind, effort));
    }
    $('.determinate').css('width', '90%');
}

/* This method fetches the weather information from the API and calls to update the table */
function ajaxWeatherInformation(num){
     //var old = "https://crossorigin.me/https://api.forecast.io/forecast/" + weatherKey + "/" + output[num].startCoordinate[0] + "," + output[num].startCoordinate[1] + "," + output[num].formattedTime + "?units=ca";
     //var standard = "https://api.forecast.io/forecast/" + weatherKey + "/" + output[num].startCoordinate[0] + "," + output[num].startCoordinate[1] + "," + output[num].formattedTime + "?units=ca";
     const standard = "./get/wind-data?lat=" + output[num].startCoordinate[0] + "&long=" + output[num].startCoordinate[1] + "&time=" + output[num].formattedTime;
     number = num;
     
     $.getJSON(standard, function (info) {
        output[num].windSpeed = info.hourly.data[12].windSpeed;
        output[num].windBearing = info.hourly.data[12].windBearing;
        done++;
        if (done == output.length){
            $('.determinate').css('width', '80%');
            calculateInfluenceRating();
            updateTable();
        }
    });
}

/* This method calls in sequential order the get weather information */
function getWeatherInformation(){
    for(var y = 0 ; y < output.length; y++){
         ajaxWeatherInformation(y);
    }
}

/* This function updates the table using jQuery */
function updateTable(){
    $("#computed tr td").remove();
    for(var x = 0; x < output.length; x++){
        $('#computed tr:last').after('<tr><td> ' + output[x].rank + '</td> <td>' + output[x].name + ' </td> <td> ' 
        + output[x].date + '</td><td>' + output[x].averageSpeed + 'km/h</td><td>'
        + output[x].windSpeed + ' km/h</td><td>' + convertToCardinal(output[x].windBearing) + '&deg;</td><td>'
         + longLatToCardinal(output[x].startCoordinate[0], output[x].startCoordinate[1],output[x].endCoordinate[0], output[x].endCoordinate[1]) 
         + '&deg;</td><td>'
         + parseFloat(-influenceRating[x]).toFixed(2) + '</td> </tr>'); //- influence?
    }
    $('.determinate').css('width', '100%');
}