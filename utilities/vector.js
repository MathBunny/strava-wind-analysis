
class Vector{
    constructor(latitude, longitude, speed){
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;

        this.unitLatitude = this.getUnitValue(latitude, longitude);
        this.unitLongitude = this.getUnitValue(longitude, latitude);
    }

    // Returns the unit value of primary
    getUnitValue(primary, secondary){
        return primary / (Math.sqrt(Math.pow(primary, 2) + Math.pow(secondary, 2)));
    }

    static resultantSpeed(speed){
        return 31 - (0.004 * Math.pow(speed, 2) - 0.616 * speed + 30.137);
    }

    static getDistance(vectorA, vectorB){
        return Math.sqrt(Math.pow(vectorA.unitLatitude - vectorB.unitLatitude, 2) + Math.pow(vectorA.unitLatitude - vectorB.unitLatitude, 2));
    }

    static getLatitudeFromBearing(bearing){
        return Math.cos(2 * Math.PI - (bearing * Math.PI / 180)- Math.PI / 2);
    }

    static getLongitudeFromBearing(bearing){
        return Math.sin(2 * Math.PI - (bearing * Math.PI / 180)-Math.PI / 2);
    }
}

exports.Vector = Vector;