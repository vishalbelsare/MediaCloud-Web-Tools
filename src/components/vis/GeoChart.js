import React from 'react';
import ReactHighcharts from 'react-highcharts/dist/ReactHighcharts.js';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps.js';
import highchartsExporting from 'highcharts-exporting';
highchartsExporting(ReactHighcharts.Highcharts);

const maps = require('./world-eckert3-lowres');

class GeoChart extends React.Component {

  getConfig() {
    const { data } = this.props;

    const config = {
      // Initiate the chart
      title: {
        text: '',
      },
      mapNavigation: {
        enabled: false,
      },
      exporting: {
        enabled: true,
      },
      navigation: {
        buttonOptions: {
          align: 'right',
        },
      },
      colorAxis: {
        min: 0.00001,
        max: 1.0,
        type: 'logarithmic',
      },
      tooltip: {
        pointFormatter: function afmtxn() {
          const pct = this.count * 100 + ' %';
          return pct;
        },
      },
      series: [{
        data: data,
        mapData: maps,
        joinBy: 'iso-a2',
        name: 'Sentence percentage',
        allowPointSelect: true,
        cursor: 'pointer',
        states: {
          hover: {
            color: '#BADA55',
          },
          select: {
            color: '#a4edba',
            borderColor: 'black',
            dashStyle: 'shortdot',
          },
        },
        dataLabels: {
          enabled: false,
          format: '{point.name} {point.count} ',
        },
      }],
    };
    return config;
  }
  gotoDashboard(handle) {
    // dispatch to dashboard
  }
  render() {
    const config = this.getConfig();
    const gtDashboard = this.gotoDashboard;
    config.exporting = true;
    config.plotOptions = {
      series: {
        point: {
          events: {
            click: function afn() {
              gtDashboard();
              alert('will go to dashboard');
            },
          },
        },
      },
    }
    return (
       React.createElement(ReactHighmaps, { config })
    );
  }
}


GeoChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  dispatchGoToDashboard: React.PropTypes.func,
};

export default GeoChart;
