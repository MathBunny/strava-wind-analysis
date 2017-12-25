const requestify = require('requestify');

class StravaDataHandler {
  // Returns array containing historical speeds on segment, sorted from oldest to most recent
  static getAthleteHistoricalSpeed(accessToken, segmentID, athleteID) {
    return new Promise((resolve) => {
      let dataArr = [];

      const maxPageCount = 49;
      let pagesComplete = 0;
      for (let page = 0; page < 50; page += 1) {
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
            const labels = [];
            if (dataArr.length > 10) {
              let count = 0; // Labels along x-axis
              for (let x = 0; x < dataArr.length; x += 1) {
                if (count >= dataArr.length / 11) {
                  labels.push(`${x}`);
                  count = 0;
                } else {
                  labels.push('');
                  count += 1;
                }
              }
            } else {
              for (let x = 0; x < dataArr.length; x += 1) {
                labels.push(x);
              }
            }
            dataArr = dataArr.sort((x, y) => (new Date(x.date) - new Date(y.date)));
            dataArr = dataArr.map(effortObj => effortObj.speed);
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
