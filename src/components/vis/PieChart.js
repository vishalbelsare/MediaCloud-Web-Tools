import React from 'react';
import { injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import initHighcharts from './initHighcharts';

const DEFAULT_HEIGHT = 320;

initHighcharts();
/**
 * Pass in data - an array of `name`/`value` objects
 */
const PieChart = (props) => {
  const { title, data, colors, tooltipText } = props;
  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      height: DEFAULT_HEIGHT,
    },
    title: {
      text: title,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    colors,
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
      },
    },
    series: [{
      colorByPoint: true,
      name: tooltipText,
      data,
    }],
  };
  return (
    <div className="pie-chart">
      <ReactHighcharts config={config} />
    </div>
  );
};

PieChart.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  data: React.PropTypes.array.isRequired,
  onPieSliceClick: React.PropTypes.func,
  colors: React.PropTypes.array.isRequired,
  tooltipText: React.PropTypes.string.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    PieChart
  );
