
function getFilterMap() {
  const filterMap = new Map();

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

  return filterMap;
}

exports.getFilterMap = getFilterMap;
