/* This class acts as the utility class for operations */
var SPEED_MULTIPLIER = 0.1; //relationship between speed and the wind vector's magnitude

/* Converts time (s) and distance (m) to km/h! */
function getAverageSpeed(time, distance){
    distance/=1000;
    time/=3600;
    return parseFloat(distance/time).toFixed(1);
}

/* Class constructor for a vector */
function Vector(x, y){
    this.x = x;
    this.y = y;
}

/* Series of vector helper methods */
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.multiply = function(speed) {
  return new Vector(this.x * speed, this.y * speed);
};

function addVectors(vectorA, vectorB){
    return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
}

function multiplySpeed(vectorA, speed){
    return new Vector(vectorA.x * speed, vectorA.y * speed);
}

/* Displacement vector for the wind speed; take into consideration the distance and the displacement distance */

function displacementWind(lat1, long1, lat2, long2, speed){
    var xDiff = lat2 - lat1;
    var yDiff = long2 - long1;
    var magnitude = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    var unitVector = new Vector(xDiff/magnitude, yDiff/magnitude);
    unitVector = multiplySpeed(unitVector, speed);
    return unitVector;
}

/* This calculates the effort made in displacement */
function displacementEffort(lat1, long1, lat2, long2, speed){
    var displacement = new Vector(lat2-lat1, long2-long1);
    var magnitude = Math.sqrt(Math.pow(displacement.x, 2) + Math.pow(displacement.y, 2));
    var unitVector = new Vector(displacement.x/magnitude, displacement.y/magnitude);
    return unitVector.multiply(speed);
}

/* This method returns the correlation between the wind bearing and the effort */
function getCorrelation(wind, effort){
    wind.speed *= SPEED_MULTIPLIER;
    effort.speed *= SPEED_MULTIPLIER;
    var windVector = displacementWind(wind.lat1, wind.long1, wind.lat2, wind.long2, wind.speed);
    var effortVector = displacementEffort(effort.lat1, effort.long1, effort.lat2, effort.long2, effort.speed);
    var addedVector = addVectors(windVector, effortVector);

    if (effortVector.x > 0 && effortVector.y > 0){
        return windVector.x + windVector.y;
    }
    else if (effortVector.x < 0 && effortVector.y > 0){
        return -windVector.x + windVector.y;
    }
    else if (effortVector.x > 0 && effortVector.y < 0){
        return windVector.x - windVector.y;
    }
    else if (effortVector.x < 0 && effortVector.y < 0){
        return -windVector.x - windVector.y;
    }
    else{
        return -1;
    }
}

/* Converts from longitude/latitude to cardinal directions */
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

/* Converts to cardinal */
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

/* Splits information into tokens */
function splitIntoTokens(strIn){
    var str = strIn.toString();
    return [str.substring(0, str.indexOf(",")-1), str.substring(str.indexOf(",")+1, str.length-1)];
}

/* Convert geographic coordinate to decimal degrees */
function convertFromDMS(str){
    return str.D + (str.M)/60 + str.S/3600;
}

/* This method returns the suffix for each respective placement */
function getFinisherSuffix(str){
    var end = str.charAt(str.length-1);

    if (end == '1'){
        return "st";
    }
    else if (end == '2'){
        return "nd";
    }
    else if (end == '3'){
        return "rd";
    }
    else{
        return "th";
    }
}