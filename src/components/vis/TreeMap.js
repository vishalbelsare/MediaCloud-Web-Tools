import React from 'react';
import { injectIntl } from 'react-intl';
import ReactHighcharts from 'react-highcharts';
import initHighcharts from './initHighcharts';

initHighcharts();

const localMessages = {
  title: { id: 'chart.treeMap.chart.title', defaultMessage: 'Stories by Source' },
  tooltipTitle: { id: 'chart.treeMap.tooltip.title', defaultMessage: '{count} of stories are from {name}.' },
};

/**
 * Pass in data - an array of `name`/`value` objects
 */
const TreeMap = (props) => {
  const { title, data, onLeafClick, color } = props;
  const { formatNumber, formatMessage } = props.intl;
  const config = {
    title: {
      text: formatMessage(localMessages.title),
    },
    series: [{
      title,
      type: 'treemap',
      layoutAlgorithm: 'squarified',
      data,
      color,
    }],
    tooltip: {
      pointFormatter: function afmtxn() {
        // important to name this, rather than use arrow function, so `this` is preserved to be what highcharts gives us
        const rounded = formatNumber(this.value, { style: 'percent', maximumFractionDigits: 2 });
        const pct = formatMessage(localMessages.tooltipTitle, { count: rounded, name: this.name });
        return pct;
      },
    },
    exporting: {
    },
  };
  if (onLeafClick) {
    config.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function handleLeafClick(event) {
              onLeafClick(event, this);  // preserve the highcharts "this", which is the chart
            },
          },
        },
      },
    };
  }
  return (
    <div className="tree-map">
      <ReactHighcharts config={config} />
    </div>
  );
};

TreeMap.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  data: React.PropTypes.array.isRequired,
  onLeafClick: React.PropTypes.func,
  color: React.PropTypes.string,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TreeMap
  );
