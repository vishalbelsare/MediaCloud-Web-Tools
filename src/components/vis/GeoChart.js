import React from 'react';
import ReactHighcharts from 'react-highcharts';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps.js';
import { injectIntl } from 'react-intl';
import Highlight from 'react-highlight';
let ReactDOM = require('react-dom');
var maps = require('./world-eckert3-highres');

class GeoChart extends React.Component {

  getConfig() {
    const { data } = this.props;
    let config = {
      // Initiate the chart
      title: {
        text: 'Geographic Attention via Highmaps',
      },

      subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World</a>',
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },

      colorAxis: {
        min: 0,
      },

      series : [{
        data: data,
        mapData: maps,
        joinBy: 'iso-a2',
        name: 'Random data',
        states: {
          hover: {
              color: '#BADA55',
          },
        },
        dataLabels: {
          enabled: false,
          format: '{point.count}',
        },
      }],
    };
    return config;
  }

  render() {
    const { data } = this.props;
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
