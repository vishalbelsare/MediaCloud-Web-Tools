import React from 'react';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps.js';
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
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },
      mapNavigation: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
      colorAxis: {
        min: 0,
      },

      series: [{
        data: data,
        mapData: maps,
        joinBy: 'iso-a2',
        name: 'Sentence percentage',
        states: {
          hover: {
            color: '#BADA55',
          },
        },
        dataLabels: {
          enabled: false,
          format: '{point.count} * 100 %',
        },
      }],
    };
    return config;
  }

  render() {
    const config = this.getConfig();
    return (
       React.createElement(ReactHighmaps, { config })
    );
  }
}

GeoChart.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default GeoChart;
