function longLatToCardinal(lat1, long1, lat2, long2) {
  const margin = Math.PI / 90; // 2 degree tolerance for cardinal directions
  const o = lat1 - lat2;
  const a = long1 - long2;
  const angle = Math.atan2(o, a);

  if (angle > -margin && angle < margin) {
    return 'E';
  } else if (angle > (Math.PI / 2) - margin && angle < (Math.PI / 2) + margin) {
    return 'N';
  } else if (angle > Math.PI - margin && angle < -Math.PI + margin) {
    return 'W';
  } else if (angle > (-Math.PI / 2) - margin && angle < (-Math.PI / 2) + margin) {
    return 'S';
  }

  if (angle > 0 && angle < Math.PI / 2) {
    return 'NE';
  } else if (angle > Math.PI / 2 && angle < Math.PI) {
    return 'NW';
  } else if (angle > -Math.PI / 2 && angle < 0) {
    return 'SE';
  }
  return 'SW';
}

function degreesToCardinal(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[(val % 16)];
}

function getPolarAngleLongLat(lat1, long1, lat2, long2) {
  const dLat = lat1 - lat2;
  const dLong = long1 - long2;
  const rad = Math.atan2(dLat, dLong);
  if (rad < 0) {
    return Math.PI + (Math.PI + rad);
  }
  return rad;
}

function convertPolarAngleToBearing(polarAngle) {
  const degAngle = (((polarAngle * 360) / (2 * Math.PI)) + 360) % 360;
  if (degAngle < 0) {
    throw Error('Angle should be non-negative');
  } else if (degAngle <= 90) {
    return 90 - degAngle;
  } else if (degAngle <= 180) {
    return 270 + (180 - degAngle);
  } else if (degAngle <= 270) {
    return 180 + (270 - degAngle);
  } else {
    return 90 + (360 - degAngle);
  }
}

function convertLatLongToCardinal(lat1, long1, lat2, long2) {
  const polarAngle = getPolarAngleLongLat(lat1, long1, lat2, long2);
  const bearing = convertPolarAngleToBearing(polarAngle);
  return degreesToCardinal(bearing);
}

exports.longLatToCardinal = longLatToCardinal;
exports.degreesToCardinal = degreesToCardinal;
exports.getPolarAngleLongLat = getPolarAngleLongLat;
exports.convertPolarAngleToBearing = convertPolarAngleToBearing;
exports.convertLatLongToCardinal = convertLatLongToCardinal;
