const requestify = require('requestify');

class StravaDataHandler {
  static getDetailedSegmentDetails(accessToken, segmentID) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}?&access_token=${accessToken}`).then((detailedSegmentResponse) => {
        const detailedSegmentDetails = JSON.parse(detailedSegmentResponse.body);
        resolve(detailedSegmentDetails);
      }).fail(err => console.log(err));
    });
  }

  static getDetailedActivityDetails(accessToken, segmentID) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/activities/${segmentID}?&access_token=${accessToken}`).then((detailedActivityResponse) => {
        const detailedActivityDetails = JSON.parse(detailedActivityResponse.body);
        resolve(detailedActivityDetails);
      }).fail(err => console.log(err));
    });
  }

  static getActivitiesList(accessToken) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/athlete/activities?&access_token=${accessToken}&per_page=200`).then((activitiesResponse) => {
        const activitesList = JSON.parse(activitiesResponse.body);
        resolve(activitesList);
      }).fail(err => console.log(err));
    });
  }

  static getActivitiesListAfterEpoch(accessToken, epoch) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/athlete/activities?&access_token=${accessToken}&after=${epoch}&per_page=200`).then((activitiesResponse) => {
        const activitesList = JSON.parse(activitiesResponse.body);
        resolve(activitesList);
      }).fail(err => console.log(err));
    });
  }

  static getActivitiesListBeforeEpoch(accessToken, epoch) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/athlete/activities?&access_token=${accessToken}&before=${epoch}&per_page=200`).then((activitiesResponse) => {
        const activitesList = JSON.parse(activitiesResponse.body);
        resolve(activitesList);
      }).fail(err => console.log(err));
    });
  }

  static getLeaderboardAthletes(accessToken, segmentID) {
    return new Promise((resolve) => {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/leaderboard?&access_token=${accessToken}`).then((segmentResponse) => {
        const segmentData = JSON.parse(segmentResponse.body);
        const arr = [];
        segmentData.entries.forEach((athlete) => {
          const entry = {};
          entry.athleteID = athlete.athlete_id;
          entry.name = athlete.athlete_name;
          arr.push(entry);
        });
        resolve(arr);
      }).fail(err => console.log(err));
    });
  }

  // Returns array containing historical speeds on segment, sorted from oldest to most recent
  static getAthleteHistoricalSpeed(accessToken, segmentID, athleteID, includeDates) {
    return new Promise((resolve) => {
      let dataArr = [];

      const maxPageCount = 4;
      let pagesComplete = 0;
      for (let page = 0; page < 5; page += 1) {
        requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${accessToken}&per_page=200&page=${page}&athlete_id=${athleteID}`).then((segmentEffortResponse) => { // eslint-disable-line
          const responseData = JSON.parse(segmentEffortResponse.body);
          responseData.forEach((effort) => {
            const speed = (effort.distance * 3.6) / effort.elapsed_time;
            const date = effort.start_date;
            const effortObj = { speed, date };
            dataArr.push(effortObj);
          });
          pagesComplete += 1;
          if (pagesComplete === maxPageCount) {
            dataArr = dataArr.sort((x, y) => (new Date(x.date) - new Date(y.date)));
            if (!includeDates) {
              dataArr = dataArr.map(effortObj => effortObj.speed);
            }
            resolve(dataArr);
          }
        });
      }
    });
  }

  // Returns segmented array into 7 indexes (0-10km/h, 10-20km/h, etc.) for individual athlete
  // For individual results set athleteID to true, else it will segment all results
  static getAthleteSegmentEffortsSegmented(accessToken, segmentID, athleteID) {
    return new Promise((resolve) => {
      const dataArr = [];
      for (let x = 0; x < 7; x += 1) {
        dataArr.push(0);
      }

      const maxPageCount = 19;
      let pagesComplete = 0;
      for (let page = 0; page < 20; page += 1) {
        let requestTarget = `https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${accessToken}&per_page=200&page=${page}`;
        if (athleteID !== undefined) {
          requestTarget += `&athlete_id=${athleteID}`;
        }

        requestify.get(requestTarget).then((segmentEffortResponse) => { // eslint-disable-line
          const responseData = JSON.parse(segmentEffortResponse.body);
          responseData.forEach((effort) => {
            const speed = (effort.distance * 3.6) / effort.elapsed_time;
            const arrIndex = Math.min(speed / 10, 6);
            dataArr[Math.floor(arrIndex)] += 1;
          });
          pagesComplete += 1;
          if (pagesComplete === maxPageCount) {
            resolve(dataArr);
          }
        });
      }
    });
  }
}

module.exports = StravaDataHandler;
