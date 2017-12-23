
function getFilterMap() {
  const filterMap = new Map();

  // Segments
  filterMap.d1 = (x => !(x.distance >= 0 && x.distance <= 0.25));
  filterMap.d2 = (x => !(x.distance >= 0.25 && x.distance <= 1));
  filterMap.d3 = (x => !(x.distance >= 1 && x.distance <= 2.5));
  filterMap.d4 = (x => !(x.distance >= 2.5 && x.distance <= 5));
  filterMap.d5 = (x => !(x.distance >= 5));

  filterMap.r1 = (x => !(parseInt(x.ranking, 10) === 1));
  filterMap.r2 = (x => !(parseInt(x.ranking, 10) >= 2 && parseInt(x.ranking, 10) <= 5));
  filterMap.r3 = (x => !(parseInt(x.ranking, 10) >= 5 && parseInt(x.ranking, 10) <= 10));
  filterMap.r4 = (x => !(parseInt(x.ranking, 10) >= 10 && parseInt(x.ranking, 10) <= 25));
  filterMap.r5 = (x => !(parseInt(x.ranking, 10) >= 25));

  // Rides
  filterMap.dr1 = (x => !(x.distance >= 0 && x.distance <= 20000));
  filterMap.dr2 = (x => !(x.distance >= 20000 && x.distance <= 50000));
  filterMap.dr3 = (x => !(x.distance >= 50000 && x.distance <= 100000));
  filterMap.dr4 = (x => !(x.distance >= 100000 && x.distance <= 200000));
  filterMap.dr5 = (x => !(x.distance >= 200000));

  filterMap.s1 = (x => !(x.speed >= 0 && x.speed <= 15));
  filterMap.s2 = (x => !(x.speed >= 15 && x.speed <= 18));
  filterMap.s3 = (x => !(x.speed >= 18 && x.speed <= 23));
  filterMap.s4 = (x => !(x.speed >= 23 && x.speed <= 27));
  filterMap.s5 = (x => !(x.speed >= 27 && x.speed <= 33));
  filterMap.s6 = (x => !(x.speed >= 33 && x.speed <= 37));
  filterMap.s7 = (x => !(x.speed >= 37));

  return filterMap;
}

exports.getFilterMap = getFilterMap;
