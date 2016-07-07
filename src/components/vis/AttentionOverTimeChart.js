import React from 'react';
import ReactHighcharts from 'react-highcharts';
import highchartsMore from 'highcharts-more';
highchartsMore(ReactHighcharts.Highcharts);
import highchartsExporting from 'highcharts-exporting';
highchartsExporting(ReactHighcharts.Highcharts);
import highchartsOfflineExporting from 'highcharts-offline-exporting';
highchartsOfflineExporting(ReactHighcharts.Highcharts);

const SECS_PER_DAY = 1000 * 60 * 60 * 24;

// don't show dots on line if more than this many data points
const SERIES_MARKER_THRESHOLD = 30;

class AttentionOverTime extends React.Component {

  getConfig() {
    const config = {
      chart: {
        type: 'spline',
        zoomType: 'x',
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
          },
        },
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%m/%e/%y',
          second: '%m/%e/%y',
          minute: '%m/%e/%y',
          hour: '%m/%e/%y',
          day: '%m/%e/%y',
          week: '%m/%e/%y',
          month: '%m/%y',
          year: '%Y',
        },
      },
      yAxis: {
        min: 0,
      },
      series: [{
        name: 'UTC',
        data: ['IE', 'IS', 'GB', 'PT'].map(function (code) {
          return { code: code };
        }),
      }, {
        name: 'UTC + 1',
        data: ['NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL', 'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR', 'BA', 'YF', 'ME', 'AL', 'MK'].map(function (code) {
          return { code: code };
        }),
      }]
    };
    return config;
  }

  render() {
    const { data, height, title, onDataPointClick, yAxisLabel, health } = this.props;
    const config = this.getConfig();
    config.title = { text: title };
    config.chart.height = height;
    config.yAxis.title = { text: yAxisLabel };
    // config.exporting.filename = title;
    config.xAxis = {
      type: 'datetime',
      plotBands: health,
    };
    if (onDataPointClick !== null) {
      config.plotOptions.series.point = { events: { click: onDataPointClick } };
    }
    config.plotOptions.series.marker.enabled = (data.length < SERIES_MARKER_THRESHOLD);
    // clean up the data
    const dates = data.map((d) => d.date);
    // turning variable time unit into days
    const intervalMs = (dates[1] - dates[0]);
    const intervalDays = intervalMs / SECS_PER_DAY;
    const values = data.map((d) => d.count / intervalDays);
    const allSeries = [{
      id: 0,
      name: yAxisLabel,
      color: '#000066',
      data: values,
      pointStart: dates[0],
      pointInterval: intervalMs,
      cursor: 'pointer',
    }];
    config.series = allSeries;
    // render out the chart
    return (
      <ReactHighcharts config={config} />
    );
  }

}

AttentionOverTime.propTypes = {
  data: React.PropTypes.array.isRequired,
  height: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  health: React.PropTypes.array,
  onDataPointClick: React.PropTypes.func,
};

export default AttentionOverTime;
