import React from 'react';
import { injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import initHighcharts from './initHighcharts';

initHighcharts();
/**
 * Pass in data - an array of `name`/`value` objects
 */
const PieChart = (props) => {
  const { title, data } = props;
  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: title,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.count:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.count:.1f} %',
          style: {
            color: 'gray',
          },
        },
      },
    },
    series: [{
      name: 'Metadata',
      colorByPoint: true,
      data: { data },
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
  color: React.PropTypes.string,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    PieChart
  );
