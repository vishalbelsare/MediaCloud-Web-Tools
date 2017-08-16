import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';
import fontSizeComputer from '../../lib/visUtil';

const localMessages = {
  word2vecTerm: { id: 'word2vec.rollover.term', defaultMessage: '{term}' },
};

const DEFAULT_WIDTH = 730;
const DEFAULT_HEIGHT = 400;
const DEFAULT_MIN_FONT_SIZE = 15;
const DEFAULT_MAX_FONT_SIZE = 45;
const DEFAULT_MIN_COLOR = '#d9d9d9';
const DEFAULT_MAX_COLOR = '#000000';

function Word2VecChart(props) {
  const { words, width, height, minFontSize, maxFontSize, minColor, maxColor, showTooltips, alreadyNormalized, fullExtent, domId } = props;
  const { formatMessage } = props.intl;

  const options = {
    width,
    height,
    minFontSize,
    maxFontSize,
    minColor,
    maxColor,
    showTooltips,
    alreadyNormalized,
    fullExtent,
  };

  if (width === undefined) {
    options.width = DEFAULT_WIDTH;
  }
  if (height === undefined) {
    options.height = DEFAULT_HEIGHT;
  }
  if (minFontSize === undefined) {
    options.minFontSize = DEFAULT_MIN_FONT_SIZE;
  }
  if (maxFontSize === undefined) {
    options.maxFontSize = DEFAULT_MAX_FONT_SIZE;
  }
  if (minColor === undefined) {
    options.minColor = DEFAULT_MIN_COLOR;
  }
  if (maxColor === undefined) {
    options.maxColor = DEFAULT_MAX_COLOR;
  }
  if (showTooltips === undefined) {
    options.showTooltips = false;
  }
  if (alreadyNormalized === undefined) {
    options.alreadyNormalized = false;
  }

  // add in tf normalization
  const allSum = d3.sum(words, term => parseInt(term.count, 10));
  if (!options.alreadyNormalized) {
    words.forEach((term, idx) => { words[idx].tfnorm = term.count / allSum; });
  }

  // start layout
  const node = ReactFauxDOM.createElement('svg');
  d3.select(node)
    .attr('width', options.width)
    .attr('height', options.height);

  const rollover = d3.select('body').append('div')
    .attr('class', 'word2vec-chart-tooltip')
    .style('opacity', 0);

  // determine appropriate margins
  const maxLengthWord = words.sort((a, b) => b.term.length - a.term.length)[0].term;
  const maxWordWidth = d3.select('body').append('span')
    .attr('class', 'word-width-span')
    .text(maxLengthWord)
    .style('font-size', `${options.maxFontSize}px`)
    .node()
    .getBoundingClientRect()
    .width;
  d3.select('.word-width-span').remove();

  const margin = {
    top: options.maxFontSize,
    right: maxWordWidth / 2,
    bottom: options.maxFontSize,
    left: maxWordWidth / 2,
  };

  // Define Scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(words, d => d.x), d3.max(words, d => d.x)])
    .range([margin.left, options.width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(words, d => d.y), d3.max(words, d => d.y)])
    .range([options.height - margin.top, margin.bottom]);

  const colorScale = d3.scaleLinear()
    .domain([d3.min(words, d => d.count), d3.max(words, d => d.count)])
    .range([options.minColor, options.maxColor]);

  // Add Text Labels
  const sizeRange = { min: options.minFontSize, max: options.maxFontSize };
  if (fullExtent === undefined) {
    options.fullExtent = d3.extent(words, d => d.tfnorm);
  }
  const text = d3.select(node).selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.term)
    .attr('x', d => xScale(d.x))
    .attr('y', d => yScale(d.y))
    .attr('fill', d => colorScale(d.count))
    .attr('font-size', (d) => {
      const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
      return `${fs}px`;
    });

  // tool-tip
  text.on('mouseover', (d) => {
    rollover.transition().duration(200).style('opacity', 0.9);
    rollover.text(formatMessage(localMessages.word2vecTerm, { term: d.term }))
      .style('left', `${d3.event.pageX}px`)
      .style('top', `${d3.event.pageY}px`);
  })
  .on('mouseout', () => {
    rollover.transition().duration(500).style('opacity', 0);
  });

  return (
    <div className="word2vec-chart" id={domId}>
      {node.toReact()}
    </div>
  );
}

Word2VecChart.propTypes = {
  // from parent
  words: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minColor: React.PropTypes.string,
  maxColor: React.PropTypes.string,
  fullExtent: React.PropTypes.array,
  showTooltips: React.PropTypes.bool,
  alreadyNormalized: React.PropTypes.bool,
  domId: React.PropTypes.string.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Word2VecChart
  );
