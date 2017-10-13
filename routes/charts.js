const express = require('express');
const requestify = require('requestify');

const router = express.Router();

router.get('/get/data/all-segment-efforts', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else {
    const segmentID = req.query.segmentID;
    const dataArr = [];
    for (let x = 0; x < 7; x += 1) {
      dataArr.push(0);
    }
    function getData(page, dataArr) { // eslint-disable-line
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${req.user.accessToken}&per_page=200&page=${page}`).then((segmentEffortResponse) => { // eslint-disable-line
        const responseData = JSON.parse(segmentEffortResponse.body);
        responseData.forEach((effort) => {
          const speed = (effort.distance * 3.6) / effort.elapsed_time;
          const arrIndex = Math.min(speed / 10, 6);
          dataArr[Math.floor(arrIndex)] += 1;
        });
        if (page === 9) {
          const data = {
            labels: ['0-10km/h', '10km/h-20km/h', '20km/h-30m/h', '30km/h-40km/h', '40km/h-50km/h', '50km/h-60km/h', '60km/h+'],
            datasets:
              [{ label: 'All Segment Efforts',
                data: dataArr,
                fill: false,
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
                borderColor:
                ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                borderWidth: 1 }],
          };
          res.send(data);
        }
      });
    }

    for (let page = 0; page < 10; page += 1) {
      getData(page, dataArr);
    }
  }
});

module.exports = router;
