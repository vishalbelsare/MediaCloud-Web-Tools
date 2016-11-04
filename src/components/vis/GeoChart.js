import React from 'react';
import ReactHighcharts from 'react-highcharts/dist/ReactHighcharts';
import ReactHighmaps from 'react-highcharts/dist/ReactHighmaps';
import highchartsExporting from 'highcharts-exporting';
import { injectIntl } from 'react-intl';

highchartsExporting(ReactHighcharts.Highcharts);

const maps = require('./world-eckert3-lowres');

const localMessages = {
  seriesName: { id: 'chart.geographyAttention.series.name', defaultMessage: 'Geographic Attention' },
  tooltipTitle: { id: 'chart.geographyAttention.title', defaultMessage: '{count}% of sentences mention {name}' },
};

class GeoChart extends React.Component {

  static gotoDashboard(event) {
    event.preventDefault();
    // cancel event, dispatch to dashboard
  }

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
          const rounded = formatNumber(this.count * 100);
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
    const config = this.getConfig();
    config.exporting = true;
    config.plotOptions = {
      series: {
        point: {
          events: {
            click: this.gotoDashboard,
          },
        },
      },
    };
    return (
       React.createElement(ReactHighmaps, { config })
    );
  }
}


GeoChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  dispatchGoToDashboard: React.PropTypes.func,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(GeoChart);
