anychart.onDocumentReady(function () {

    // create a data set on our data
    var dataSet = anychart.data.set(getData());
  
    // map data for the first series,
    // take x from the zero column and value from the first column
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
  
    // map data for the second series,
    // take x from the zero column and value from the second column
    var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
  
    // map data for the third series,
    // take x from the zero column and value from the third column
    var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });
  
    // map data for the fourth series,
    // take x from the zero column and value from the fourth column
    var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });
  
    // create a line chart
    var chart = anychart.line();
  
    // turn on the line chart animation
    chart.animation(true);
  
    // configure the chart title text settings
    chart.title('Acceptance of same-sex relationships in the US over the last 2 decades');
  
    // set the y axis title
    chart.yAxis().title('% of people who accept same-sex relationships');
  
    // turn on the crosshair
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
  
    // create the first series with the mapped data
    var firstSeries = chart.line(firstSeriesData);
    firstSeries
      .name('18-34')
      .stroke('3 #f49595')
      .tooltip()
      .format('Age group 18-34 : {%value}%');
  
    // create the second series with the mapped data
    var secondSeries = chart.line(secondSeriesData);
    secondSeries
      .name('35-49')
      .stroke('3 #f9eb97')
      .tooltip()
      .format('Age group 35-49 : {%value}%');
  
    // create the third series with the mapped data
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries
      .name('50-64')
      .stroke('3 #a8d9f6')
      .tooltip()
      .format('Age group 50-64 : {%value}%');
  
    // create the fourth series with the mapped data
    var fourthSeries = chart.line(fourthSeriesData);
    fourthSeries
      .name('65+')
      .stroke('3 #e2bbfd')
      .tooltip()
      .format('Age group 65+ : {%value}%');
  
    // turn the legend on
    chart.legend().enabled(true);
  
    // set the container id for the line chart
    chart.container('container');
  
    // draw the line chart
    chart.draw();
  
  });
  
  function getData() {
    return [
      ['1990',16.9,12.2,10.2,5.2],
      ['1991',17,17.8,10,4.8],
      ['1993',26.5,23.8,16.8,6.6],
      ['1994',28.7,22,17.3,9.1],
      ['1996',35.7,24,22.6,9.2],
      ['1998',37.2,24.6,22.4,11.2],
      ['2000',36.5,26.2,23.7,9.9],
      ['2002',40,34.4,23.8,16.4],
      ['2004',33.3,28.8,32.5,14.3],
      ['2006',40.2,32.1,27.5,15.1],
      ['2008',49.3,37.2,31.4,17.1],
      ['2010',51.9,42.5,36.1,28.5],
      ['2012',53.1,43.8,36,24.6],
      ['2014',63.7,45.9,44.7,31.3],
      ['2016',66.3,52,42.3,37.2],
      ['2018',70.1,57.7,49.2,39]
    ];
  }