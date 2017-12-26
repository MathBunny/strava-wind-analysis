
const colors = new Map();
colors[0] = 'rgb(244,67,54)';
colors[1] = 'rgb(233,30,99)';
colors[2] = 'rgb(156,39,176)';
colors[3] = 'rgb(103,58,183)';
colors[4] = 'rgb(63,81,181)';
colors[5] = 'rgb(33,150,243)';
colors[6] = 'rgb(3,169,244)';
colors[7] = 'rgb(0,188,212)';
colors[8] = 'rgb(0,150,136)';
colors[9] = 'rgb(76,175,80)';
colors[10] = 'rgb(139,195,74)';
colors[11] = 'rgb(205,220,57)';
colors[12] = 'rgb(255,235,59)';
colors[13] = 'rgb(255,193,7)';
colors[14] = 'rgb(255,152,0)';
colors[15] = 'rgb(121,85,72)';
colors[16] = 'rgb(158,158,158)';

class LineChartUtils {
  static getColor(count) {
    return colors[count % 17];
  }
}
module.exports = LineChartUtils;
