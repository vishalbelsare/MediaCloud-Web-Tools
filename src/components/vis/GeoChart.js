import React from 'react';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps';
import { injectIntl } from 'react-intl';
import initHighcharts from './initHighcharts';

initHighcharts();

const maps = require('./world-eckert3-lowres');

const localMessages = {
  title: { id: 'chart.geographyAttention.chart.title', defaultMessage: 'Mentions by Country' },
  seriesName: { id: 'chart.geographyAttention.series.name', defaultMessage: 'Geographic Attention' },
  tooltipTitle: { id: 'chart.geographyAttention.title', defaultMessage: '{count} of sentences mention {name}' },
};

class GeoChart extends React.Component {

  getConfig() {
    const { data } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
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
        min: 0.000001,
        max: 1.0,
        type: 'logarithmic',
      },
      tooltip: {
        pointFormatter: function afmtxn() {
          // important to name this, rather than use arrow function, so `this` is preserved to be what highcharts gives us
          const rounded = formatNumber(this.count, { style: 'percent', maximumFractionDigits: 2 });
          const pct = formatMessage(localMessages.tooltipTitle, { count: rounded, name: this.name });
          return pct;
        },
      },
      series: [{
        data,
        mapData: maps,
        joinBy: 'iso-a2',
        name: formatMessage(localMessages.seriesName),
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
      legend: {
        layout: 'vertical',
        valueDecimals: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        itemStyle: {
          fontWeight: 'bold',
          fontStyle: 'italic',
          color: 'gray',
          textDecoration: 'none',
        },
        maxHeight: 150,
        symbolHeight: 70,
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
      },
    };
    return config;
  }

  render() {
    const { onCountryClick } = this.props;
    const config = this.getConfig();
    config.exporting = true;
    if (onCountryClick) {
      config.plotOptions = {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function handleCountryClick(event) {
                onCountryClick(event, this);  // preserve the highcharts "this", which is the chart
              },
            },
          },
        },
      };
    }
    return (
       React.createElement(ReactHighmaps, { config })
    );
  }
}


GeoChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  onCountryClick: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(GeoChart);
