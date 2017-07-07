import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 730;
const DEFAULT_HEIGHT = 300;
const DEFAULT_PADDING = 20;

function Word2VecChart(props) {
  const { domId, data } = props;

  const options = {};

  options.width = DEFAULT_WIDTH;
  options.height = DEFAULT_HEIGHT;
  options.padding = DEFAULT_PADDING;

  // start layout
  const node = ReactFauxDOM.createElement('svg');
  d3.select(node)
    .attr('width', options.width)
    .attr('height', options.height);

  // Define Scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([options.padding, options.width - (options.padding * 2)]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([options.height - options.padding, options.padding]);

  const fontScale = d3.scaleLog()
    .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
    .range([10, 30]);

  const colors = ['#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'];
  const colorScale = d3.scaleLog()
    .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
    .range(colors);

  // Add Text Labels
  const pixel = 'px';
  d3.select(node).selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d.word)
    .attr('x', d => xScale(d.x))
    .attr('y', d => yScale(d.y))
    .attr('font-size', d => fontScale(d.count) + pixel)
    .attr('fill', d => colorScale(d.count));

  // Define X axis and attach to graph
  // const xAxis = d3.axisBottom(xScale);
  // d3.select(node)
  //  .append('g')
  //  .call(xAxis);

  // Define Y axis and attach to graph
  // const yAxis = d3.axisLeft(yScale);
  // d3.select(node)
  //  .append('g')
  //  .call(yAxis);

  return (
    <div className="word2vec-chart" id={domId}>
      {node.toReact()}
    </div>
  );
}

Word2VecChart.propTypes = {
  // from parent
  data: React.PropTypes.array.isRequired,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  domId: React.PropTypes.string.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Word2VecChart
  );
