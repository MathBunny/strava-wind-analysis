var express = require('express');
var router = express.Router();
const passport = require('passport');
const requestify = require('requestify');
const handlebars = require('handlebars');
const Vector = require('../utilities/vector').Vector;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    //console.log(req.user);
    //requestify.get("https://www.strava.com/api/v3/segments/" + 10112025 + "/leaderboard?&access_token=" + req.user.accessToken + "")
    //requestify.get("https://www.strava.com/api/v3/athletes/" + req.user.id + "/koms?access_token=" + req.user.accessToken)

    // step #1: Get the list of activities
    // step #2: Get the list of segments within each activity (https://www.strava.com/api/v3/activities/:id)

    let segmentIDs = new Set();
    let segments = [];
    let target = undefined;
    let count = 0;

    requestify.get("https://www.strava.com/api/v3/athlete/activities?access_token=" + req.user.accessToken).then(response => {
        let activities = JSON.parse(response.body);
        target = activities.length;
        activities.forEach(activity => { // activity.name, activity.id
          requestify.get("https://www.strava.com/api/v3/activities/" + activity.id + "?access_token=" + req.user.accessToken).then(activityDetailsResponse => {
            let activityDetails = JSON.parse(activityDetailsResponse.body);
            activityDetails.segment_efforts.forEach(segment => {
              let pr_rank = segment.pr_rank;
              segment = segment.segment;
              if (!segmentIDs.has(segment.id) && !segmentIDs.has(segment.name)){
                segmentIDs.add(segment.id);
                segmentIDs.add(segment.name);
                
                segments.push({name: segment.name, id: segment.id, distance: (segment.distance / 1000).toFixed(2), average_grade: segment.average_grade, maximum_grade: segment.maximum_grade, ranking: pr_rank, city: segment.city, province: segment.state, country: segment.country});
              }
            });
            count++;
            if (count == target){
              let data = {};
              data.segments = segments;
              res.render('segments', data);
            }
          });
        })
    });
    // Async
  }
});

router.get('/details', (req, res, next) => {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else if (req.query.id == undefined){
    res.render('error', {message: "No supplied segment id!"});
  }
  else{
    let leaderboard = [];
    let segmentID = req.query.id;
    requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "/leaderboard?&access_token=" + req.user.accessToken).then(response => {
        const leaderboardResponse = JSON.parse(response.body);
        leaderboardResponse.entries.forEach(effort => {
          leaderboard.push(effort);
        });

        // Get segment information
        requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "?&access_token=" + req.user.accessToken).then(segmentResponse => {
          let segmentData = JSON.parse(segmentResponse.body);
          segmentData.distance /= 1000;
          segmentData.distance = segmentData.distance.toFixed(2);
          segmentData.leaderboard = leaderboard;
          segmentData.participants = leaderboardResponse.entry_count;
          segmentData.leaderboardLink = "https://www.strava.com/segments/" + segmentID + "?filter=overall";
          segmentData.latitude = segmentData.start_latlng[0];
          segmentData.longitude = segmentData.start_latlng[1];
          let polyline = "";
          for(var x = 0; x < segmentData.map.polyline.length; x++){
            if (segmentData.map.polyline.charAt(x) != '\\'){
              polyline += segmentData.map.polyline.charAt(x);
            }
            else{
              polyline += '\\' + segmentData.map.polyline.charAt(x);
            }
          }
          segmentData.map.polyline = polyline;

          let count = 0;
          segmentData.leaderboard.forEach(effort => {
            effort.start_date_iso = effort.start_date;
            effort.start_date = effort.start_date.substring(0, 10);
            effort.rank = effort.rank + ((effort.rank % 10 == 1) ? ("st") : (effort.rank % 10 == 2) ? ("nd") : (effort.rank % 10 == 3) ? "rd" : "th");
            effort.speed = (((effort.distance * 3.6) / effort.elapsed_time).toFixed(2)) + "km/h";
            
            var darkskyrequest = "https://api.forecast.io/forecast/81c978e8db7b136e4bf3c8988c2d90a6/" + segmentData.latitude + "," + segmentData.longitude + "," + effort.start_date_iso + "?units=ca";
            requestify.get(darkskyrequest).then(windDataResponse => {
              let windData = JSON.parse(windDataResponse.body);
              let date = new Date(effort.start_date_iso);
              effort.wind_speed = windData.hourly.data[date.getHours()].windSpeed;
              effort.wind_speed_str = effort.wind_speed.toFixed(2);
              effort.wind_bearing = windData.hourly.data[date.getHours()].windBearing;
              effort.wind_bearing_str = convertToCardinal(effort.wind_bearing);
              effort.ride_bearing_str = longLatToCardinal(segmentData.start_latlng[0], segmentData.start_latlng[1], segmentData.end_latlng[0], segmentData.end_latlng[1]);

              try{
                let windVector = new Vector(Vector.getLatitudeFromBearing(effort.wind_bearing), Vector.getLongitudeFromBearing(effort.wind_bearing));
                let segmentVector = new Vector(parseFloat(segmentData.latitude), parseFloat(segmentData.longitude));
                let roundoffValue = 1 - Vector.getDistance(windVector, segmentVector);
                let speed = Vector.resultantSpeed(parseInt(effort.wind_speed));
                effort.coefficient = speed * roundoffValue;
                effort.coefficient_str = (effort.coefficient).toFixed(2);
              }
              catch(e){
                console.log(e);
              }
              
              count++;
              if (count == segmentData.leaderboard.length){
                res.render('details', segmentData);
              }
            }).fail(err => {
              res.render('error', {message: error});
              console.log(err);
            });
          });
        }).fail(errorResponse => {
          let errorMessage = JSON.parse(errorResponse.body);
          res.render('error', {message: errorMessage.message});
        });
    }).fail(errorResponse => {
      let errorMessage = JSON.parse(errorResponse.body);
      res.render('error', {message: errorMessage.message});
    });
  }
});

function longLatToCardinal(lat1, long1, lat2, long2){
    margin = Math.PI/90; // 2 degree tolerance for cardinal directions
    o = lat1 - lat2;
    a = long1 - long2;
    angle = Math.atan2(o,a);

    if (angle > -margin && angle < margin)
            return "E";
    else if (angle > Math.PI/2 - margin && angle < Math.PI/2 + margin)
            return "N";
    else if (angle > Math.PI - margin && angle < -Math.PI + margin)
            return "W";
    else if (angle > -Math.PI/2 - margin && angle < -Math.PI/2 + margin)
            return "S";
    
    if (angle > 0 && angle < Math.PI/2) 
        return "NE";
    else if (angle > Math.PI/2 && angle < Math.PI) {
        return "NW";
    } else if (angle > -Math.PI/2 && angle < 0) {
        return "SE";
    } else {
        return "SW";
    }
    return "error";
}

function convertToCardinal(q){ 
    s=String;
    s.prototype.a=s.prototype.replace;
    var a=q/11.25,a=a+0.5|0,b,k,c=a,d=c%8,c=c/8|0,e=["north","east","south","west"],f,g,h;
    f=e[c];
    g=e[(c+1)%4];
    h=f==e[0]|f==e[2]?f+g:g+f;
    b="1;1 by 2;1-C;C by 1;C;C by 2;2-C;2 by 1".split(";")[d].a(1,f).a(2,g).a("C",h);
    k=b.a(/north/g,"N").a(/east/g,"E").a(/south/g,"S").a(/west/g,"W").a(/by/g,"").a(/[\s-]/g,"");
    b=b[0].toUpperCase()+b.slice(1); //credits to overflow for such a short solution!
    return(k)
}

module.exports = router;