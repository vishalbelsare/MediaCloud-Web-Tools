import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
const DEFAULT_MAX_BUBBLE_RADIUS = 70;
const DEFAULT_HEIGHT = 200;

// options for bubble `placement`
export const PLACEMENT_AUTO = 'PLACEMENT_AUTO';
export const PLACEMENT_HORIZONTAL = 'PLACEMENT_HORIZONTAL';
const DEFAULT_PLACEMENT = PLACEMENT_AUTO;

// options for `textPlacement`
export const TEXT_PLACEMENT_ABOVE = 'TEXT_ABOVE';
export const TEXT_PLACEMENT_CENTER = 'TEXT_CENTER';
export const TEXT_PLACEMENT_ROLLOVER = 'TEXT_PLACEMENT_ROLLOVER';
const DEFAULT_TEXT_PLACEMENT = TEXT_PLACEMENT_CENTER;

/**
 * Draw a bubble chart with labels.  Values are mapped to area, not radius.
 */
class BubbleChart extends React.Component {

  render() {
    const { data, width, height, maxBubbleRadius, placement, textPlacement, domId } = this.props;
    const { formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxBubbleRadius,
      placement,
      textPlacement,
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
    if ((textPlacement === null) || (textPlacement === undefined)) {
      options.textPlacement = DEFAULT_TEXT_PLACEMENT;
    }

    // prep the data and some config (scale by sqrt of value so we map to area, not radius)
    const maxValue = d3.max(data.map(d => d.value));
    const radius = d3.scaleSqrt().domain([0, maxValue]).range([0, options.maxBubbleRadius]);
    let circles = null;
    switch (options.placement) {
      case PLACEMENT_HORIZONTAL:      // EXPERIMENTAL
        circles = data.map((d, idx, list) => {
          const preceeding = list.slice(0, idx);
          const diameters = preceeding.map(d2 => (radius(d2.value) + 5) * 2);
          const xOffset = diameters.reduce((a, b) => a + b, 0);
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
      const bubbles = svg.append('g')
        .attr('transform', `translate(${(options.width - totalWidth) / 2},${options.height / 2})`)
        .selectAll('.bubble')
        .data(circles)
        .enter();
      // create the bubbles
      bubbles.append('circle')
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', d => d.color || '');

      // add tooltip to bubbles for rollover option
      if ((options.textPlacement ? options.textPlacement : textPlacement) === TEXT_PLACEMENT_ROLLOVER) {
        bubbles.selectAll('circle').on('mouseover', (d) => {
          const pixel = 'px';
          rollover.transition().duration(200).style('opacity', 0.9);
          rollover.html(d.label)
            .style('left', d3.event.pageX + pixel)
            .style('top', d3.event.pageY + pixel);
        })
        .on('mouseout', () => {
          rollover.transition().duration(500).style('opacity', 0);
        });
      }

      // format the text for each bubble
      let textYPlacement = null;
      switch (options.textPlacement ? options.textPlacement : textPlacement) {
        case TEXT_PLACEMENT_ABOVE:
          textYPlacement = d => d.y - d.r - 12;
          break;
        case TEXT_PLACEMENT_CENTER:
          textYPlacement = d => d.y;
          break;
        case TEXT_PLACEMENT_ROLLOVER:
          textYPlacement = d => d.y - 4;
          break;
        default:
          textYPlacement = d => d.y;
          break;
      }

      // don't show labels for rollover option
      if ((options.textPlacement ? options.textPlacement : textPlacement) !== TEXT_PLACEMENT_ROLLOVER) {
        bubbles.append('text')
          .attr('x', d => d.x)
          .attr('y', d => textYPlacement(d) - 6)
          .attr('text-anchor', 'middle')
          .attr('fill', d => `${d.labelColor} !important` || '')
          .text(d => d.label);
      }
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => textYPlacement(d) + 7)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.labelColor} !important` || '')
        .text(d => `${formatNumber(d.value)} ${d.unit ? d.unit : ''}`);

      content = node.toReact();
    }

    return content;
  }
}

BubbleChart.propTypes = {
  intl: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired, // [ {'label': string, 'value': number, 'color': string(optional), 'labelColor': string(optional)}, ... ]
  domId: React.PropTypes.string.isRequired,  // to make download work
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  placement: React.PropTypes.string,
  textPlacement: React.PropTypes.string,
  maxBubbleRadius: React.PropTypes.number,
};

export default injectIntl(BubbleChart);
