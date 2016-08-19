import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import highchartsMore from 'highcharts-more';
import highchartsExporting from 'highcharts-exporting';

highchartsMore(ReactHighcharts.Highcharts);
highchartsExporting(ReactHighcharts.Highcharts);

const SECS_PER_DAY = 1000 * 60 * 60 * 24;

// don't show dots on line if more than this many data points
const SERIES_MARKER_THRESHOLD = 30;

const localMessages = {
  chartTitle: { id: 'chart.sentencesOverTime.title', defaultMessage: 'Attention Over Time' },
  chartYAxisLabel: { id: 'chart.sentencesOverTime.yAxisLabel', defaultMessage: 'sentences / day' },
  totalCount: { id: 'chart.sentencesOverTime.totalCount',
    defaultMessage: '{total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

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
    const { total, data, height, onDataPointClick, health, lineColor } = this.props;
    const { formatMessage } = this.props.intl;
    // setup up custom chart configuration
    const config = this.getConfig();
    config.chart.height = height;
    config.exporting.filename = formatMessage(localMessages.chartYAxisLabel);
    if ((health !== null) && (health !== undefined)) {
      config.xAxis = {
        plotBands: health,
      };
    }
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
      name: formatMessage(localMessages.chartYAxisLabel),
      color: lineColor,
      data: values,
      pointStart: dates[0],
      pointInterval: intervalMs,
      cursor: 'pointer',
    }];
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
  data: React.PropTypes.array.isRequired,
  height: React.PropTypes.number.isRequired,
  lineColor: React.PropTypes.string.isRequired,
  health: React.PropTypes.array,
  onDataPointClick: React.PropTypes.func,
  total: React.PropTypes.number,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(AttentionOverTimeChart);
