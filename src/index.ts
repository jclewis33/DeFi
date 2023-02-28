import Chart from 'chart.js/auto';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Fetch Block
  function updateChart() {
    async function fetchData() {
      const url = 'https://api.llama.fi/protocol/aave';
      const response = await fetch(url);
      //wait until the request has been completed
      const datapoints = await response.json();
      //console.log the datapoints to make sure it is calling the api
      console.log(datapoints);
      //saves the datapoints for futher use
      return datapoints;
    }
    //we are using the information from the datapoints in the api to update the values of the chart
    //updating the year
    fetchData().then((datapoints) => {
      const year = datapoints.tvl.map(function (index) {
        return index.date;
      });
      //updating the totalLiquidityUSD
      const count = datapoints.tvl.map(function (index) {
        return index.totalLiquidityUSD;
      });
      console.log(year);
      console.log(count);
      //updates the chart with the datapoints above. myChart is pulled from the variable below.
      myChart.config.data.labels = year;
      //Define datasets as an array [0]and then the property you want to change
      myChart.config.data.datasets[0].data = count;
      myChart.update();
    });
  }

  //Calls the function above
  updateChart();

  //chart data
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 45 },
    { year: 2016, count: 28 },
  ];
  const ctx = document.getElementById('myChart');

  //You must name the chart as a variable (const myChart) in order to pass information above from the api call to the datapoints on the chart
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: 'Historical TVL of AAVE',
          data: data.map((row) => row.count),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
