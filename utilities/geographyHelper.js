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

function convertToCardinal(q) {
  let s = String;
  s.prototype.a = s.prototype.replace;
  a = q / 11.25, a = a + 0.5 | 0, b, k, c = a, d = c % 8, c = c / 8 | 0, e = ['north', 'east', 'south', 'west'], f, g, h;
  f = e[c];
  g = e[(c + 1) % 4];
  h = f == e[0] | f == e[2] ? f + g : g + f;
  b = '1;1 by 2;1-C;C by 1;C;C by 2;2-C;2 by 1'.split(';')[d].a(1, f).a(2, g).a('C', h);
  k = b.a(/north/g, 'N').a(/east/g, 'E').a(/south/g, 'S').a(/west/g, 'W').a(/by/g, '').a(/[\s-]/g, '');
  b = b[0].toUpperCase() + b.slice(1);
  return k;
}

exports.longLatToCardinal = longLatToCardinal;
exports.convertToCardinal = convertToCardinal;
