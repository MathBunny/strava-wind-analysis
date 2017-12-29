const stravadatahandler = require('./stravadatahandler');

class Recommender {
  static getAchievementPoints(achievements) {
    let pts = 0;
    achievements.forEach((achievement) => {
      if (achievement.type === 'overall') {
        pts += 20 - parseInt(achievement.rank, 10);
      } else if (achievement.type === 'pr') {
        pts += 5 - parseInt(achievement.rank, 10);
      }
    });
    return pts;
  }

  // Returns (at minimum, if possible) 3 segments sorted by a heuristic point system
  static getSegmentRecommendations(accessToken) {
    return new Promise((resolve) => {
      stravadatahandler.getActivitiesList(accessToken).then((activitiesListResponse) => {
        // Algorithm A: Look at last 3 activities and rank efforts

        const activitiesList = activitiesListResponse.filter((activity => activity.type === 'Ride' && activity.manual === false));
        const weightedPts = new Map();
        let scores = [];
        weightedPts.set(0, 10);
        weightedPts.set(1, 5);

        return new Promise((resolveA) => {
          stravadatahandler.getDetailedActivityDetails(accessToken, activitiesList[0].id).then((activity) => {
            activity.segment_efforts.forEach((segmentEffort) => { // eslint-disable-line
              let pts = weightedPts.get(0);
              if (pts === undefined) {
                pts = 0;
              }
              pts += Recommender.getAchievementPoints(segmentEffort.achievements);
              scores.push({ score: pts, segmentDetails: segmentEffort });
            });
            resolveA();
          });
        }).then(() => {
          return new Promise((resolveB) => { // eslint-disable-line
            stravadatahandler.getDetailedActivityDetails(accessToken, activitiesList[1].id).then((activity) => {
              activity.segment_efforts.forEach((segmentEffort) => { // eslint-disable-line
                let pts = weightedPts.get(1);
                if (pts === undefined) {
                  pts = 0;
                }
                pts += Recommender.getAchievementPoints(segmentEffort.achievements);
                scores.push({ score: pts, segmentDetails: segmentEffort });
              });
              resolveB();
            });
          });
        }).then(() => {
          return new Promise((resolveC) => { // eslint-disable-line
            stravadatahandler.getDetailedActivityDetails(accessToken, activitiesList[2].id).then((activity) => {
              activity.segment_efforts.forEach((segmentEffort) => { // eslint-disable-line
                let pts = weightedPts.get(1);
                if (pts === undefined) {
                  pts = 0;
                }
                pts += Recommender.getAchievementPoints(segmentEffort.achievements);
                scores.push({ score: pts, segmentDetails: segmentEffort });
              });
              resolveC();
            });
          });
        }).then(() => {
          if (scores.length >= 3) {
            scores = scores.sort((x, y) => y.score - x.score);
            const set = new Set();
            scores = scores.filter((score) => {
              if (set.has(score.segmentDetails.segment.id)) {
                return false;
              }
              set.add(score.segmentDetails.segment.id);
              return true;
            });
            resolve(scores);
          } else {
            // Algorithm B: Take the most recent segment efforts (greedily)
            let count = activitiesList.length;
            const f = new Promise((resolveD) => {
              activitiesList.forEach((activity) => {
                stravadatahandler.getDetailedActivityDetails(accessToken, activity.id).then((detailedActivity) => {
                  detailedActivity.segment_efforts.forEach((segmentEffort) => {
                    scores.push({ segmentDetails: segmentEffort });
                  });
                  count -= 1;
                  if (count === 0) {
                    resolveD();
                  }
                });
              });
            });
            f.then(() => resolve(scores));
          }
        });
      });
    });
  }
}
module.exports = Recommender;
