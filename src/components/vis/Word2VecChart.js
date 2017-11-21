import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';
import fontSizeComputer from '../../lib/visUtil';

const localMessages = {
  word2vecTerm: { id: 'word2vec.rollover.term', defaultMessage: '{term}' },
};

const DEFAULT_WIDTH = 530;
const DEFAULT_HEIGHT = 320;
const DEFAULT_MIN_FONT_SIZE = 10;
const DEFAULT_MAX_FONT_SIZE = 30;
const DEFAULT_MIN_COLOR = '#d9d9d9';
const DEFAULT_MAX_COLOR = '#000000';

function Word2VecChart(props) {
  const { words, scaleWords, width, height, minFontSize, maxFontSize, minColor, maxColor, showTooltips, alreadyNormalized,
          fullExtent, domId, xProperty, yProperty } = props;
  const { formatMessage } = props.intl;

  const options = {
    scaleWords,
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
  options.xProperty = xProperty || 'x';
  options.yProperty = yProperty || 'y';
  options.scaleWords = scaleWords || words;

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
  const maxLengthWord = options.scaleWords.sort((a, b) => b.term.length - a.term.length)[0].term;
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
    .domain([d3.min(options.scaleWords, d => d[options.xProperty]), d3.max(options.scaleWords, d => d[options.xProperty])])
    .range([margin.left, options.width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(options.scaleWords, d => d[options.yProperty]), d3.max(options.scaleWords, d => d[options.yProperty])])
    .range([options.height - margin.top, margin.bottom]);

  // Add Text Labels
  const sizeRange = { min: options.minFontSize, max: options.maxFontSize };
  if (fullExtent === undefined) {
    options.fullExtent = d3.extent(words, d => d.tfnorm);
  }

  const colorScale = d3.scaleLinear()
    .domain(options.fullExtent)
    .range([options.minColor, options.maxColor]);

  const sortedWords = words.sort((a, b) => a.tfnorm - b.tfnorm); // important to sort so z order is right
  const text = d3.select(node).selectAll('text')
    .data(sortedWords)
    .enter()
      .append('text')
        .attr('text-anchor', 'middle')
        .text(d => d.term)
        .attr('x', d => xScale(d[options.xProperty]))
        .attr('y', d => yScale(d[options.yProperty]))
        .attr('fill', d => colorScale(d.tfnorm))
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
  scaleWords: React.PropTypes.array,
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
  xProperty: React.PropTypes.string,
  yProperty: React.PropTypes.string,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    Word2VecChart
  );
