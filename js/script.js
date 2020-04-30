import "./byeie"; // loučíme se s IE
fetch("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv")
  .then(response => response.text())
  .then(data => {
      let result = d3.csvParse(data, function (d) {
          return {
              datum: new Date(d.date),
              stat: d.state,
              fips: d.fips,
              z: Number(d.cases),
              umrti: Number(d.deaths),
          }
      });
      let datumy = [];
      result.forEach(d => datumy.push(d.datum));
      let maxDatum = Math.max.apply(null, datumy);
      let aktualniResult = result.filter(d => d.datum.valueOf() === maxDatum);

      Highcharts.mapChart('containerusa', {
          chart: {
              borderWidth: 0,
              map: 'countries/us/custom/us-all-mainland'
          },
          title: {
              text: 'Počet nakažených COVID-19 ve státech USA k ' + new Date(maxDatum).getDate() + '.' + (new Date(maxDatum).getMonth() + 1) + '.' + new Date(maxDatum).getFullYear()
          },
          subtitle: {
              text: 'Pro přesný údaj o počtu nakažených a mrtvých vyberte stát'
          },
          credits: {
            text: 'Zdroj dat: The New York Times',
            href: 'https://github.com/nytimes/covid-19-data/',
            mapText: ''
          },
          legend: {
              enabled: false
          },
          mapNavigation: {
              enabled: false,
          },
          tooltip: {
              formatter: function() {
                  return `<strong>${this.point.properties.name}</strong>: ${this.point.z} potvrzených případů, ${this.point.umrti} mrtvých`
              }
          },
          series: [{
              name: 'States',
              color: '#d52834',
              enableMouseTracking: false
          }, {
              type: 'mapbubble',
              name: 'Potvrzené případy',
              color: '#d52834',
              data: aktualniResult,
              joinBy: ['woe-name', 'stat'],
              minSize: 2,
              maxSize: '20%'
          }]
      });
  });