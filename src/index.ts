//auto pulls entire chart, reduce to needed components when in use
import Chart from 'chart.js/auto';
//entire code block is wrapped in initial function to push to webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  // Fetch Block
  function updateChart() {
    async function fetchData() {
      const url = 'https://api.llama.fi/charts';
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
      const year = datapoints.map(function (index) {
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
      const count = datapoints.map(function (index) {
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

  //chart dummy data, api data is passed in using function below data.map((row) => row.year)),
  const data = [{ year: 2010, count: 10 }];
  const ctx = document.getElementById('myChart');

  //You must name the chart as a variable (const myChart) in order to pass information above from the api call to the datapoints on the chart
  const myChart = new Chart(ctx, {
    //determines chart type
    type: 'line',
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: 'Historical TVL',
          data: data.map((row) => row.count),
          fill: true,
          borderColor: 'rgb(75, 35, 157)', //determines line color
          tension: 0.1,
          pointRadius: 0, // disable for all `'line'` datasets only draws line no points on the line
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
