import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
const DEFAULT_MAX_BUBBLE_RADIUS = 70;
const DEFAULT_HEIGHT = 200;

class BubbleChart extends React.Component {

  render() {
    const { data, width, height, maxBubbleRadius } = this.props;
    const { formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxBubbleRadius,
    };
    if (width !== null) {
      options.width = DEFAULT_WIDTH;
    }
    if (height !== null) {
      options.height = DEFAULT_HEIGHT;
    }
    if (maxBubbleRadius !== null) {
      options.maxBubbleRadius = DEFAULT_MAX_BUBBLE_RADIUS;
    }

    // prep the data and some config
    const maxValue = d3.max(data.map(d => d.value));
    const radius = d3.scaleLinear().domain([0, maxValue]).range([0, options.maxBubbleRadius]);
    const bubbleData = data.map(d => ({ ...d, r: radius(d.value) }));
    // start the packing
    const circles = d3.packSiblings(bubbleData);

    // render it all
    const node = ReactFauxDOM.createElement('svg');
    const svg = d3.select(node)
      .attr('width', options.width)
      .attr('height', options.height)
      .attr('class', 'bubble-chart');
    const bubbles = svg.append('g')
      .attr('transform', `translate(${options.width / 2},${options.height / 2})`)
      .selectAll('.bubble')
      .data(circles)
      .enter();
    // create the bubbles
    bubbles.append('circle')
      .attr('r', d => d.r)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .style('fill', d => d.color || '');
    // format the text for each bubble
    bubbles.append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y - d.r - 18)
      .attr('text-anchor', 'middle')
      .attr('fill', d => `${d.labelColor} !important` || '')
      .text(d => d.label);
    bubbles.append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y - d.r - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', d => `${d.labelColor} !important` || '')
      .text(d => formatNumber(d.value));

    return node.toReact();
  }

}

BubbleChart.propTypes = {
  intl: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired, // [ {'label': string, 'value': number, 'color': string(optional), 'labelColor': string(optional)}, ... ]
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxBubbleRadius: React.PropTypes.number,
};

export default injectIntl(BubbleChart);
