import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
const DEFAULT_MIN_BUBBLE_RADIUS = 5;
const DEFAULT_MAX_BUBBLE_RADIUS = 70;
const DEFAULT_HEIGHT = 200;

// options for bubble `placement`
export const PLACEMENT_AUTO = 'PLACEMENT_AUTO';
export const PLACEMENT_HORIZONTAL = 'PLACEMENT_HORIZONTAL';
const DEFAULT_PLACEMENT = PLACEMENT_AUTO;

const localMessages = {
  noData: { id: 'chart.bubble.noData', defaultMessage: 'Sorry, but we don\'t have any data to draw this chart.' },
};

/**
 * Draw a bubble chart with labels.  Values are mapped to area, not radius.
 */
class BubbleChart extends React.Component {

  render() {
    const { data, width, height, maxBubbleRadius, minBubbleRadius, placement, domId } = this.props;

    // bail if no data
    if (data.length === 0) {
      return (
        <div>
          <p><FormattedMessage {...localMessages.noData} /></p>
        </div>
      );
    }

    // const { formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxBubbleRadius,
      minBubbleRadius,
      placement,
    };
    if ((width === null) || (width === undefined)) {
      options.width = DEFAULT_WIDTH;
    }
    if ((height === null) || (height === undefined)) {
      options.height = DEFAULT_HEIGHT;
    }
    if ((minBubbleRadius === null) || (minBubbleRadius === undefined)) {
      options.minBubbleRadius = DEFAULT_MIN_BUBBLE_RADIUS;
    }
    if ((maxBubbleRadius === null) || (maxBubbleRadius === undefined)) {
      options.maxBubbleRadius = DEFAULT_MAX_BUBBLE_RADIUS;
    }
    if ((placement === null) || (placement === undefined)) {
      options.placement = DEFAULT_PLACEMENT;
    }

    // prep the data and some config (scale by sqrt of value so we map to area, not radius)
    const maxValue = d3.max(data.map(d => d.value));
    const radius = d3.scaleSqrt().domain([0, maxValue]).range([0, options.maxBubbleRadius]);
    let circles = null;
    let hierarchialData = null;
    let pack = null;

    switch (options.placement) {
      case PLACEMENT_HORIZONTAL:
        circles = data.map((d, idx, list) => {
          let xOffset = 0;
          if (idx > 0) {
            const preceeding = list.slice(0, idx);
            const diameters = preceeding.map(d2 => (radius(d2.value) * 2) + 10);
            xOffset = d3.sum(diameters);
          }
          xOffset += radius(d.value);
          return {
            ...d,
            r: radius(d.value),
            y: 0,
            x: xOffset,
          };
        });
        break;
      case PLACEMENT_AUTO:

        hierarchialData = [].concat(data).concat([{ name: 'top', id: 'top', value: 0, x: 0, y: 0 }]);
        hierarchialData = d3.stratify()
          .id((d, idx) => ((d.centerText ? d.centerText : d.name) ? d.name : idx))
          .parentId(d => (d.centerText || d.name === undefined ? 'top' : undefined))(hierarchialData)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

        pack = d3.pack().size([options.width, options.height]);

        circles = pack(hierarchialData).descendants();
        break;
      default:
        const error = { message: `BubbleChart received invalid placement option of ${options.placement}` };
        throw error;
    }
    let content = null;
    if (circles && circles.length > 0) {
      // render it all
      const node = ReactFauxDOM.createElement('div');
      const div = d3.select(node).append('div').attr('id', 'bubble-chart-wrapper');
      const svg = div.append('svg:svg');
      svg.attr('id', domId)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('class', 'bubble-chart');
      // rollover tooltip
      const rollover = d3.select('body').append('div')
        .attr('class', 'bubble-chart-tooltip')
        .style('opacity', 0);

      // only center align if auto layout
      const horizontalTranslaton = (options.placement === PLACEMENT_HORIZONTAL) ? 0 : options.width / 2;
      const bubbles = svg.append('g')
          .attr('transform', `translate(${horizontalTranslaton},${options.height / 2})`)
          .selectAll('.bubble')
          .data(circles)
          .enter();

      // create the bubbles
      /* Note:
       * for horizontal placement, the we calc the placement and the attr fields are accessed at top level,
         for AUTO, it is auto-packed and the attr fields we want are stored in the data obj
       */
      const midW = options.width / 2;
      const midH = options.height / 2;

      if (options.placement === PLACEMENT_HORIZONTAL) {
        bubbles.append('circle')
          .attr('r', d => d.r)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .style('fill', d => d.fill || '');
      } else if (options.placement === PLACEMENT_AUTO) {
        bubbles.append('circle')
          .style('fill', d => ((d.fill ? d.fill : d.data) ? d.data.fill : ''))
          .style('fill-opacity', d => (d.parent !== null ? 1 : 0))
          .style('display', d => (d.parent !== null ? 'inline' : 'none'))
          .attr('transform', d => `translate(${d.x - midW},${d.y - midH})`)
          .attr('r', d => d.r);
      }
      // add tooltip to bubbles
      bubbles.selectAll('circle').on('mouseover', (d) => {
        const pixel = 'px';
        rollover.transition().duration(200).style('opacity', 0.9);
        rollover.html((d.rolloverText ? d.rolloverText : d.data) ? d.data.rolloverText : '')
          .style('left', d3.event.pageX + pixel)
          .style('top', d3.event.pageY + pixel);
      })
      .on('mouseout', () => {
        rollover.transition().duration(500).style('opacity', 0);
      });

      // add center labels
      bubbles.append('text')
        .attr('x', d => d.x - midW)
        .attr('y', d => (d.y - midH))
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.centerTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10px')
        .text(d => ((d.centerText ? d.centerText : d.data) ? d.data.centerText : ''));

      // add top labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y - d.r - 7)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.aboveTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10px')
        .text(d => ((d.aboveText ? d.aboveText : d.data) ? d.data.aboveText : ''));

      // add bottom labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + d.r + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.belowTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10px')
        .text(d => ((d.belowText ? d.belowText : d.data) ? d.data.belowText : ''));

      content = node.toReact();
    }

    return content;
  }
}

BubbleChart.propTypes = {
  intl: React.PropTypes.object.isRequired,
  /*
  [{
    'value': number,
    'fill': string(optional),
    'centerText': string(optional),
    'centerTextColor': string(optional),
    'aboveText': string(optional),
    'aboveTextColor': string(optional),
    'belowText': string(optional),
    'belowTextColor': string(optional),
    'rolloverText': string(optional),
  }]
  */
  data: React.PropTypes.array.isRequired,
  domId: React.PropTypes.string.isRequired,  // to make download work
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  placement: React.PropTypes.string,
  maxBubbleRadius: React.PropTypes.number,
  minBubbleRadius: React.PropTypes.number,
};

export default injectIntl(BubbleChart);
