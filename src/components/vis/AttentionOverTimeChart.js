import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import initHighcharts from './initHighcharts';

initHighcharts();

const SECS_PER_DAY = 1000 * 60 * 60 * 24;

// don't show dots on line if more than this many data points
const SERIES_MARKER_THRESHOLD = 30;

const localMessages = {
  chartTitle: { id: 'chart.sentencesOverTime.title', defaultMessage: 'Attention Over Time' },
  chartYAxisLabel: { id: 'chart.sentencesOverTime.yAxisLabel', defaultMessage: 'sentences / day' },
  totalCount: { id: 'chart.sentencesOverTime.totalCount',
    defaultMessage: 'We have collected {total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

/**
 * Pass in "data" if you are using one series, otherwise configure them yourself and pass in "series".
 */
class AttentionOverTimeChart extends React.Component {

  getConfig() {
    const { formatMessage } = this.props.intl;
    const config = {
      title: formatMessage(localMessages.chartTitle),
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
        title: formatMessage(localMessages.chartYAxisLabel),
      },
      exporting: {
      },
    };
    return config;
  }

  render() {
    const { total, data, series, height, onDataPointClick, lineColor, health, filename } = this.props;
    const { formatMessage } = this.props.intl;
    // setup up custom chart configuration
    const config = this.getConfig();
    config.chart.height = height;
    if (filename !== undefined) {
      config.exporting.filename = filename;
    } else {
      config.exporting.filename = formatMessage(localMessages.chartYAxisLabel);
    }
    if ((health !== null) && (health !== undefined)) {
      config.xAxis.plotBands = health;
    }
    if (onDataPointClick) {
      config.plotOptions.series.allowPointSelect = true;
      config.plotOptions.series.point = {
        events: {
          click: function handleDataPointClick(evt) {
            const point0 = evt.point;
            const date0 = new Date(point0.x);
            // handle clicking on last point
            const point1 = (point0.index < (point0.series.data.length - 1)) ? point0.series.data[evt.point.index + 1] : point0;
            const date1 = new Date(point1.x);
            onDataPointClick(date0, date1, evt, this);   // preserve the highcharts "this", which is the chart
          },
        },
      };
    }
    let allSeries = null;
    if (data !== undefined) {
      config.plotOptions.series.marker.enabled = (data.length < SERIES_MARKER_THRESHOLD);
      // clean up the data
      const dates = data.map(d => d.date);
      // turning variable time unit into days
      const intervalMs = (dates[1] - dates[0]);
      const intervalDays = intervalMs / SECS_PER_DAY;
      const maxCount = Math.max(...data.map(d => d.count));
      const minCount = Math.min(...data.map(d => d.count));
      // handle small sample size
      const values = data.map(d => (((d.count - minCount) / (maxCount - minCount)) / intervalDays));
      allSeries = [{
        id: 0,
        name: formatMessage(localMessages.chartYAxisLabel),
        color: lineColor,
        data: values,
        pointStart: dates[0],
        pointInterval: intervalMs,
      }];
    } else if (series !== undefined) {
      allSeries = series;
      config.plotOptions.series.marker.enabled = (series[0].data.length < SERIES_MARKER_THRESHOLD);
    }
    config.series = allSeries;
    // show total if it is included
    let totalInfo = null;
    if ((total !== null) && (total !== undefined)) {
      totalInfo = (
        <p>
          <FormattedMessage
            {...localMessages.totalCount}
            values={{ total, formattedTotal: (<FormattedNumber value={total} />) }}
          />
        </p>
      );
    }
    // render out the chart
    return (
      <div className="sentences-over-time-chart">
        {totalInfo}
        <ReactHighcharts config={config} />
      </div>
    );
  }

}

AttentionOverTimeChart.propTypes = {
  // from parent
  data: React.PropTypes.array,
  series: React.PropTypes.array,
  height: React.PropTypes.number.isRequired,
  lineColor: React.PropTypes.string,
  health: React.PropTypes.array,
  onDataPointClick: React.PropTypes.func, // (date0, date1, evt, chartObj)
  total: React.PropTypes.number,
  filename: React.PropTypes.string,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(AttentionOverTimeChart);
