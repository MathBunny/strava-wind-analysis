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

exports.longLatToCardinal = longLatToCardinal;
exports.degreesToCardinal = degreesToCardinal;
