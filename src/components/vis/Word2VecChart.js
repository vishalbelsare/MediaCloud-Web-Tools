import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 750;
const DEFAULT_HEIGHT = 400;

function Word2VecChart(props) {
  const { domId, data } = props;

  const options = {};
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30,
  };

  options.width = DEFAULT_WIDTH - margin.left - margin.right;
  options.height = DEFAULT_HEIGHT - margin.top - margin.bottom;

  // start layout
  const node = ReactFauxDOM.createElement('svg');
  d3.select(node)
    .attr('width', DEFAULT_WIDTH)
    .attr('height', DEFAULT_HEIGHT);

  const rollover = d3.select('body').append('div')
    .attr('class', 'bubble-chart-tooltip')
    .style('opacity', 0);

  // Define Scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x) - 0.1, d3.max(data, d => d.x) + 0.1])
    .range([margin.left, options.width - margin.right])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y) - 0.1, d3.max(data, d => d.y) + 0.1])
    .range([options.height - margin.top, margin.bottom])
    .nice();

  const fontScale = d3.scaleLog()
    .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
    .range([10, 30]);

  const colors = ['#f0f0f0', '#bdbdbd', '#737373', '#252525', '#000000'];
  const colorScale = d3.scaleLog()
    .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
    .range(colors);

  // Add Text Labels
  const pixel = 'px';
  const words = d3.select(node).selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.word)
    .attr('x', d => xScale(d.x))
    .attr('y', d => yScale(d.y))
    .attr('font-size', d => fontScale(d.count) + pixel)
    .attr('fill', d => colorScale(d.count));

  words.on('mouseover', (d) => {
    rollover.transition().duration(200).style('opacity', 0.9);
    rollover.text(`${d.word}: ${d.count}`)
    .style('left', `${d3.event.pageX}px`)
    .style('top', `${d3.event.pageY}px`);
  })
  .on('mouseout', () => {
    rollover.transition().duration(500).style('opacity', 0);
  });

  // Define X axis and attach to graph
  const xAxis = d3.axisBottom(xScale);
  d3.select(node)
    .append('g')
    .attr('transform', `translate(0, ${options.height - margin.bottom})`)
    .call(xAxis);

  // Define Y axis and attach to graph
  const yAxis = d3.axisLeft(yScale);
  d3.select(node)
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);

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
