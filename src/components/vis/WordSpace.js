import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import fontSizeComputer from '../../lib/visUtil';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  noData: { id: 'wordspace.noData', defaultMessage: 'Not enough data to show.' },
};

// TODO: width and height should always be the same; need to condense into one value
//       (or stick square viz into a rectangular div)
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 800;

const DEFAULT_MIN_FONT_SIZE = 10;
const DEFAULT_MAX_FONT_SIZE = 30;
const DEFAULT_MIN_COLOR = '#d9d9d9';
const DEFAULT_MAX_COLOR = '#000000';
const DEFAULT_COS_SIM_THRESHOLD = 0.95;
const DEFAULT_MOUSEOVER_TRANSITION_TIME = 400;

const RADIUS_RATIOS = [1, 0.75, 0.5, 0.25];

function WordSpace(props) {
  const { words, scaleWords, width, height, minFontSize, maxFontSize, minColor, maxColor, showTooltips, alreadyNormalized,
          fullExtent, domId, xProperty, yProperty, noDataMsg, cosSimThreshold } = props;

  // const { formatMessage } = props.intl;

  // bail if the properties aren't there
  const wordsWithXYCount = words.filter(w => (w[xProperty] !== undefined) && (w[yProperty] !== undefined)).length;
  const missingDataMsg = noDataMsg || localMessages.noData;
  if (wordsWithXYCount === 0) {
    return (
      <WarningNotice>
        <FormattedHTMLMessage {...missingDataMsg} />
      </WarningNotice>
    );
  }

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
    cosSimThreshold,
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
  if (cosSimThreshold === undefined) {
    options.cosSimThreshold = DEFAULT_COS_SIM_THRESHOLD;
  }

  // add in tf normalization
  const allSum = d3.sum(words, term => parseInt(term.count, 10));
  if (!options.alreadyNormalized) {
    words.forEach((term, idx) => { words[idx].tfnorm = term.count / allSum; });
  }

  if (fullExtent === undefined) {
    options.fullExtent = d3.extent(words, d => d.tfnorm);
  }

  options.xProperty = xProperty || 'x';
  options.yProperty = yProperty || 'y';

  // alternative list of words used to set scales and margins
  options.scaleWords = scaleWords || words;

  // TODO: do this on word embeddings server?
  // add in similarity score
  words.forEach((a, i) => {
    words[i].similar = [];
    words.forEach((b) => {
      if (a.term !== b.term) {
        const dotProd = (a[options.xProperty] * b[options.xProperty]) + (a[options.yProperty] * b[options.yProperty]);
        const aLen = ((a[options.xProperty] ** 2) + (a[options.yProperty] ** 2)) ** 0.5;
        const bLen = ((b[options.xProperty] ** 2) + (b[options.yProperty] ** 2)) ** 0.5;
        const cosSim = dotProd / (aLen * bLen);
        if (cosSim > options.cosSimThreshold) {
          words[i].similar.push({ term: b.term, tfnorm: b.tfnorm, score: cosSim });
        }
      }
    });
  });

  // TODO: make margin adapt to size of largest word to avoid cut-off
  const margin = 80;
  const maxRadius = d3.max(options.scaleWords.map(d => ((d[options.xProperty] ** 2) + (d[options.yProperty] ** 2)) ** 0.5));

  // Define Scales
  const xScale = d3.scaleLinear()
    .domain([-maxRadius, maxRadius])
    .range([margin, options.width - margin]);

  const yScale = d3.scaleLinear()
   .domain([-maxRadius, maxRadius])
   .range([options.height - margin, margin]);

  // TODO: use constant for colors
  const blueScale = d3.scaleLinear()
                      .domain(options.fullExtent)
                      .range(['#9ecae1', '#08306b']);

  // TODO: use constant for colors
  const orangeScale = d3.scaleLinear()
                        .domain(options.fullExtent)
                        .range(['#fdae6b', '#7f2704']);

  const scaledRadius = xScale(0) - yScale(maxRadius);

  const sizeRange = { min: options.minFontSize, max: options.maxFontSize };

  // start layout
  const node = ReactFauxDOM.createElement('svg');
  d3.select(node)
    .attr('id', 'test')
    .attr('width', options.width)
    .attr('height', options.height);

  // TODO: add zoom here

  // draw arc 'tooltip'
  const arcContainer = d3.select(node).append('g').attr('id', 'arc-tip');
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(scaledRadius)
    .startAngle(0)
    .endAngle(Math.acos(options.cosSimThreshold) * 2);
  arcContainer.append('path')
    .attr('d', arc)
    .attr('id', 'arc')
    // TODO: make this color a constant
    .attr('fill', '#f2f2ff')
    .attr('transform', `translate(${xScale(0)}, ${yScale(0)})`)
    .style('opacity', 0);

  // draw concentric circles
  const circleContainer = d3.select(node).append('g').attr('id', 'concentric-circles');
  for (let i = 0; i < 4; i += 1) {
    circleContainer.append('circle')
      .attr('id', `circle-${i}`)
      .attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .attr('r', scaledRadius * RADIUS_RATIOS[i])
      .attr('stroke', '#efefef')
      .style('fill', 'none');
  }

  // TODO: angle lines

  // Add circle at origin
  d3.select(node)
    .append('circle')
    .attr('id', 'origin')
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .attr('r', 5)
    .style('fill', 'black');

  // Add Text Labels
  const sortedWords = words.sort((a, b) => a.tfnorm - b.tfnorm); // important to sort so z order is right
  d3.select(node)
    .selectAll('text')
    .data(sortedWords)
    .enter()
      .append('text')
        .attr('text-anchor', 'middle')
        .text(d => d.term)
        .attr('id', d => d.term)
        .attr('x', d => xScale(d[options.xProperty]))
        .attr('y', d => yScale(d[options.yProperty]))
        .attr('fill', d => blueScale(d.tfnorm))
        .attr('font-size', (d) => {
          const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
          return `${fs}px`;
        })
        .on('mouseover', (d) => {
          // console.log(d3.select(this)); // prints undefined
          // highlight selected word and move to front
          d3.select(`#${d.term}`)
            .transition()
            .duration(DEFAULT_MOUSEOVER_TRANSITION_TIME)
            .attr('fill', orangeScale(d.tfnorm))
            .attr('font-size', () => {
              const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
              return `${1.5 * fs}px`;
            })
            .attr('font-weight', 'bold');
          d3.select(`#${d.term}`).raise();
        })
        .on('mouseout', (d) => {
          // return selected word to normal
          d3.select(`#${d.term}`)
            .transition()
            .duration(DEFAULT_MOUSEOVER_TRANSITION_TIME)
            .attr('fill', blueScale(d.tfnorm))
            .attr('font-size', () => {
              const fs = fontSizeComputer(d, options.fullExtent, sizeRange);
              return `${fs}px`;
            })
            .attr('font-weight', 'bold');

          // this should work, but doesn't...
          // d3.select(node)
          //   .selectAll('text')
          //   .transition().duration(100)
          //   .attr('fill', blueScale(other => other.tfnorm))
          //   .attr('font-size', (other) => {
          //     const fs = fontSizeComputer(other, options.fullExtent, sizeRange);
          //     return `${fs}px`;
          //   })
          //   .attr('font-weight', 'normal')
          //   .attr('pointer-events', 'auto');
        });

  return (
    <div className="wordspace-chart" id={domId}>
      {node.toReact()}
    </div>
  );
}

WordSpace.propTypes = {
  // from parent
  words: PropTypes.array.isRequired,
  scaleWords: React.PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  minFontSize: PropTypes.number,
  maxFontSize: PropTypes.number,
  minColor: PropTypes.string,
  maxColor: PropTypes.string,
  fullExtent: PropTypes.array,
  showTooltips: PropTypes.bool,
  alreadyNormalized: PropTypes.bool,
  domId: PropTypes.string.isRequired,
  xProperty: PropTypes.string,
  yProperty: PropTypes.string,
  noDataMsg: PropTypes.object,
  cosSimThreshold: PropTypes.number,
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    WordSpace
  );
