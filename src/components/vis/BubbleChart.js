import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
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
    const { data, width, height, maxBubbleRadius, placement, domId } = this.props;

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
      placement,
    };
    if ((width === null) || (width === undefined)) {
      options.width = DEFAULT_WIDTH;
    }
    if ((height === null) || (height === undefined)) {
      options.height = DEFAULT_HEIGHT;
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
        const bubbleData = data.map(d => ({ ...d, r: radius(d.value) }));
        circles = d3.packSiblings(bubbleData);
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
      const totalWidth = circles.slice(-1)[0].x + circles.slice(-1)[0].r; // TODO: make this support bubble packing too
      // only center align if auto layout
      const horizontalTranslaton = (options.placement === PLACEMENT_HORIZONTAL) ? 0 : (options.width - totalWidth) / 2;
      const bubbles = svg.append('g')
          .attr('transform', `translate(${horizontalTranslaton},${options.height / 2})`)
          .selectAll('.bubble')
          .data(circles)
          .enter();
      // create the bubbles
      bubbles.append('circle')
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', d => d.fill || '');

      // add tooltip to bubbles
      bubbles.selectAll('circle').on('mouseover', (d) => {
        const pixel = 'px';
        rollover.transition().duration(200).style('opacity', 0.9);
        rollover.html(d.rolloverText)
          .style('left', d3.event.pageX + pixel)
          .style('top', d3.event.pageY + pixel);
      })
      .on('mouseout', () => {
        rollover.transition().duration(500).style('opacity', 0);
      });

      // add center labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 7)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.centerTextColor} !important` || '')
        .text(d => d.centerText);

      // add top labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y - d.r - 7)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.aboveTextColor} !important` || '')
        .text(d => d.aboveText);

      // add bottom labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + d.r + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.belowTextColor} !important` || '')
        .text(d => d.belowText);

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
};

export default injectIntl(BubbleChart);
