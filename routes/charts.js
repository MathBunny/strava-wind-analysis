const express = require('express');
const requestify = require('requestify');
const stravadatahandler = require('../data/stravadatahandler');
const mldatahandler = require('../data/mldatahandler');
const ChartFactory = require('../charts/chartfactory');
const LineChartDatasetDecorator = require('../charts/decorators/linechartdatasetdecorator');
const darkskydatahandler = require('../data/darkskydatahandler');
const geography = require('../utilities/geography');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

const router = express.Router();

router.get('/get/chart/individual-wind-radar', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    stravadatahandler.getAthleteHistoricalSpeed(req.user.accessToken, req.query.segmentID, req.query.athleteID, true).then((data) => {
      MongoClient.connect(config.mongoDBUrl, (dbErr, db) => {
        if (dbErr) {
          res.render('error', { message: (dbErr) });
        }
        db.collection('users').findOne({ id: req.user.id }, (findErr, result) => {
          const today = new Date();
          const dd = today.getDate();
          const mm = today.getMonth();
          const yyyy = today.getFullYear();
          const dateStr = `${dd}|${mm}|${yyyy}`;

          const api = result.api[dateStr];

          if (api !== undefined && api + data.length >= config.dailyDarkSkyLimit) {
            res.render('error', { message: 'You have exceeded the daily weather API limit. \n\n You can review your daily usage under settings.' });
          } else {
            const obj = result.api;
            obj[dateStr] = (api === undefined) ? (1) : (api + data.length);
            const newVal = { $set: { api: obj } };
            db.collection('users').updateOne({ id: req.query.athleteID }, newVal, () => {
              db.close();
            });

            stravadatahandler.getDetailedSegmentDetails(req.user.accessToken, req.query.segmentID).then((segmentDetails) => {
              const latitude = segmentDetails.start_latlng[0];
              const longitude = segmentDetails.start_latlng[1];
              const dataArrCum = {};
              const dataArrCount = {};
              for (let x = 0; x < 8; x += 1) {
                dataArrCum[x] = 0;
                dataArrCount[x] = 0;
              }

              let complete = 0;
              data.forEach((effort) => {
                darkskydatahandler.getWeatherDetails(config.weatherKey, req.query.athleteID, latitude, longitude, effort.date).then((windData) => {
                  const date = new Date(effort.date);

                  const windBearing = windData.hourly.data[date.getHours()].windBearing;
                  const windBearingStr = geography.degreesToCardinalSimple(windBearing);
                  const mapping = {
                    N: 0,
                    NE: 1,
                    E: 2,
                    SE: 3,
                    S: 4,
                    SW: 5,
                    W: 6,
                    NW: 7,
                  };
                  dataArrCum[mapping[windBearingStr]] += effort.speed;
                  dataArrCount[mapping[windBearingStr]] += 1;
                  complete += 1;

                  if (complete === data.length) {
                    const dataArr = [];

                    for (let x = 0; x < 8; x += 1) {
                      if (dataArrCum[x] !== 0) {
                        dataArrCum[x] /= dataArrCount[x];
                        dataArr.push(dataArrCum[x]);
                      } else {
                        dataArr.push(0);
                      }
                    }
                    
                    const chart = ChartFactory.getChart('radarwindchart', dataArr, 'Average Individual Performance per Direction');
                    const chartData = {
                      data: chart.getData(),
                      options: chart.getOptions(),
                    };
                    res.send(chartData);
                  }
                });
              });
            });
          }
        });
      });
    });
  }
});

router.get('/get/chart/individual-historical-regression', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    stravadatahandler.getAthleteHistoricalSpeed(req.user.accessToken, req.query.segmentID, req.query.athleteID).then((data) => {
      mldatahandler.getLinearRegression(data).then((regression) => {
        let chart = ChartFactory.getChart('performancelinechart', data, 'Individual Performance');
        chart = new LineChartDatasetDecorator(chart, regression, 'Ordinary Linear Regression', false);
        const chartData = {
          data: chart.getData(),
          options: chart.getOptions(),
        };
        res.send(chartData);
      });
    });
  }
});

router.get('/get/chart/leaderboard-historical-performance', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else {
    stravadatahandler.getLeaderboardAthletes(req.user.accessToken, req.query.segmentID).then((athletes) => {
      let chart;
      let count = 0;

      let arr = [];
      const p = new Promise((resolve) => {
        athletes.forEach((athlete) => {
          stravadatahandler.getAthleteHistoricalSpeed(req.user.accessToken, req.query.segmentID, athlete.athleteID).then((data) => {
            const obj = {};
            obj.data = data;
            obj.athlete = athlete;
            arr.push(obj);

            count += 1;
            if ((count - athletes.length) === 0) {
              resolve();
            }
          });
        });
      });
      p.then(() => {
        count = 0;
        arr = arr.sort((x, y) => (y.data.length - x.data.length));
        arr.forEach((obj) => {
          const athlete = obj.athlete;
          const data = obj.data;
          if (chart === undefined) {
            chart = ChartFactory.getChart('performancelinechart', data, athlete.name, true);
          } else {
            chart = new LineChartDatasetDecorator(chart, data, athlete.name);
          }
          count += 1;
          if ((count - athletes.length) === 0) {
            const chartData = {
              data: chart.getData(),
              options: chart.getOptions(),
            };
            res.send(chartData);
          }
        });
      });
    }).catch(error => console.error(error));
  }
});


router.get('/get/chart/individual-historical-performance', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    stravadatahandler.getAthleteHistoricalSpeed(req.user.accessToken, req.query.segmentID, req.query.athleteID).then((data) => {
      const chart = ChartFactory.getChart('performancelinechart', data, 'Individual Performance');
      const chartData = {
        data: chart.getData(),
        options: chart.getOptions(),
      };
      res.send(chartData);
    });
  }
});

router.get('/get/chart/aggregate-individual', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    stravadatahandler.getAthleteSegmentEffortsSegmented(req.user.accessToken, req.query.segmentID, req.query.athleteID).then((data) => {
      const chart = ChartFactory.getChart('aggregatebarchart', data, 'Individual Performance');
      const chartData = {
        data: chart.getData(),
        options: chart.getOptions(),
      };
      res.send(chartData);
    });
  }
});

router.get('/get/chart/aggregate-leaderboard', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else {
    stravadatahandler.getAthleteSegmentEffortsSegmented(req.user.accessToken, req.query.segmentID).then((data) => {
      const chart = ChartFactory.getChart('aggregatebarchart', data, 'All Segment Efforts');
      const chartData = {
        data: chart.getData(),
        options: chart.getOptions(),
      };
      res.send(chartData);
    });
  }
});

router.get('/get/data/athlete-segment-history', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    const segmentID = req.query.segmentID;
    const athleteID = req.query.athleteID;
    let dataArr = [];

    const maxPageCount = 49;
    let pagesComplete = 0;
    for (let page = 0; page < 50; page += 1) {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${req.user.accessToken}&per_page=200&page=${page}&athlete_id=${athleteID}`).then((segmentEffortResponse) => { // eslint-disable-line
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
          const data = {
            labels: labels, // eslint-disable-line
            datasets:
              [{ type: 'line',
                label: 'Historical Performance',
                data: dataArr,
                fill: false,
                backgroundColor: ['rgb(75, 192, 192)'],
                borderColor:
                ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                borderWidth: 1,
                lineTension: 0.2 }],
          };
          res.send(data);
        }
      });
    }
  }
});

router.get('/get/data/athlete-segment-efforts', (req, res) => {
  if (!req.isAuthenticated()) {
    res.send({ error: 'error: unauthenticated user' });
  } else if (req.query.segmentID === undefined) {
    res.send({ error: 'error: undefined segment ID' });
  } else if (req.query.athleteID === undefined) {
    res.send({ error: 'error: undefined athlete ID' });
  } else {
    const segmentID = req.query.segmentID;
    const athleteID = req.query.athleteID;
    const dataArr = [];
    for (let x = 0; x < 7; x += 1) {
      dataArr.push(0);
    }

    const maxPageCount = 9;
    let pagesComplete = 0;
    for (let page = 0; page < 10; page += 1) {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${req.user.accessToken}&per_page=200&page=${page}&athlete_id=${athleteID}`).then((segmentEffortResponse) => { // eslint-disable-line
        const responseData = JSON.parse(segmentEffortResponse.body);
        responseData.forEach((effort) => {
          const speed = (effort.distance * 3.6) / effort.elapsed_time;
          const arrIndex = Math.min(speed / 10, 6);
          dataArr[Math.floor(arrIndex)] += 1;
        });
        pagesComplete += 1;
        if (pagesComplete === maxPageCount) {
          const data = {
            labels: ['0-10km/h', '10km/h-20km/h', '20km/h-30m/h', '30km/h-40km/h', '40km/h-50km/h', '50km/h-60km/h', '60km/h+'],
            datasets:
              [{ label: 'Individual Segment Efforts',
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
  }
});

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

    const maxPageCount = 9;
    let pagesComplete = 0;
    for (let page = 0; page < 10; page += 1) {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${req.user.accessToken}&per_page=200&page=${page}`).then((segmentEffortResponse) => { // eslint-disable-line
        const responseData = JSON.parse(segmentEffortResponse.body);
        responseData.forEach((effort) => {
          const speed = (effort.distance * 3.6) / effort.elapsed_time;
          const arrIndex = Math.min(speed / 10, 6);
          dataArr[Math.floor(arrIndex)] += 1;
        });
        pagesComplete += 1;
        if (pagesComplete === maxPageCount) {
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
  }
});


router.get('/get/data/all-segment-efforts-imposed', (req, res) => {
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

    const maxPageCount = 9;
    let pagesComplete = 0;
    for (let page = 0; page < 10; page += 1) {
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/all_efforts?&access_token=${req.user.accessToken}&per_page=200&page=${page}`).then((segmentEffortResponse) => { // eslint-disable-line
        const responseData = JSON.parse(segmentEffortResponse.body);
        responseData.forEach((effort) => {
          const speed = (effort.distance * 3.6) / effort.elapsed_time;
          const arrIndex = Math.min(speed / 10, 6);
          dataArr[Math.floor(arrIndex)] += 1;
        });
        pagesComplete += 1;
        if (pagesComplete === maxPageCount) {
          const data = {
            labels: ['0-10km/h', '10km/h-20km/h', '20km/h-30m/h', '30km/h-40km/h', '40km/h-50km/h', '50km/h-60km/h', '60km/h+'],
            datasets:
              [{ type: 'bar',
                label: 'All Segment Efforts',
                data: dataArr,
                fill: false,
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
                borderColor:
                ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                borderWidth: 1 },
              { type: 'line',
                label: 'All Segment Efforts',
                data: dataArr,
                fill: false,
                backgroundColor: ['rgb(75, 192, 192)'],
                borderColor:
                ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                lineTension: 0.7,
                borderWidth: 3 },
              ],
          };
          res.send(data);
        }
      });
    }
  }
});

module.exports = router;
