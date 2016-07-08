import React from 'react';
import ReactHighcharts from 'react-highcharts/dist/ReactHighcharts.js';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps.js';

import highchartsExporting from 'highcharts-exporting';
highchartsExporting(ReactHighcharts.Highcharts);
import highchartsOfflineExporting from 'highcharts-offline-exporting';
highchartsOfflineExporting(ReactHighcharts.Highcharts);
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
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },
      colorAxis: {
        min: 1,
        max: 100,
        type: 'logarithmic',
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
          format: '{point.count} ',
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
