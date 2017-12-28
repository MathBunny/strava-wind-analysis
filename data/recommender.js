const stravadatahandler = require('./stravadatahandler');

class Recommender {
  static getAchievementPoints(achievements) {
    let pts = 0;
    achievements.forEach((achievement) => {
      if (achievement.type === 'overall') {
        pts += 20 - achievement.rank;
      } else if (achievement.type === 'pr') {
        pts += 3 - achievement.pr;
      }
    });
    return pts;
  }

  // Returns (at minimum, if possible) 3 segments sorted by a heuristic point system
  static getSegmentRecommendations(accessToken) {
    return new Promise((resolve) => {
      stravadatahandler.getActivitiesList(accessToken).then((activitiesList) => {
        // Algorithm A: Look at last 3 activities and rank efforts
        const weightedPts = new Map();
        const scores = [];
        weightedPts.set(0, 20);
        weightedPts.set(1, 10);
        weightedPts.set(2, 0);
        for (let x = 0; x < 3; x += 1) {
          activitiesList[x].segment_efforts.forEach((segmentEffort) => { // eslint-disable-line
            const pts = weightedPts.get(x) + Recommender.getAchievementPoints(segmentEffort.achievements);
            scores.push({ score: pts, segmentDetails: segmentEffort });
          });
        }
        if (scores.length >= 3) {
          scores.sort((x, y) => y.score - x.score);
          resolve(scores);
        } else {
          // Algorithm B: Take the most recent segment efforts (greedily)
          activitiesList.forEach((activity) => {
            activity.segment_efforts.forEach((segmentEffort) => {
              scores.push({ segmentDetails: segmentEffort });
            });
            resolve(scores);
          });
        }
      });
    });
  }
}
module.exports = Recommender;
