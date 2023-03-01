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
        // Extract the timestamp and convert it to a Date object
        const timestamp = index.date;
        const date = new Date(timestamp * 1000);

        // Extract the month, day, and year components of the date and format them as a string in the standard US format (MM/DD/YYYY)
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        // Return the formatted date string
        return formattedDate;
      });
      //updating the totalLiquidityUSD
      const count = datapoints.tvl.map(function (index) {
        // Convert the totalLiquidityUSD value to millions or billions and round the result to two decimal places

        const { totalLiquidityUSD } = index;
        const million = 1000000;
        const billion = 1000000000;
        let formattedValue;
        if (totalLiquidityUSD >= billion) {
          formattedValue = (totalLiquidityUSD / billion).toFixed(2) + 'B';
        } else if (totalLiquidityUSD >= million) {
          formattedValue = (totalLiquidityUSD / million).toFixed(2) + 'M';
        } else {
          formattedValue = totalLiquidityUSD.toFixed(2);
        }
        //return formattedValue; for the converion above but it doesn't seem to be working at this point.
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

  //chart dummy data. new data is passed in using function below
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
          label: 'Historical TVL',
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
