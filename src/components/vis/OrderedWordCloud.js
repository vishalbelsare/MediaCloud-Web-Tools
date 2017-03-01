import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const localMessages = {
  wordCloudCount: { id: 'wordcloud.rollover.count', defaultMessage: 'Uses: {count}' },
  wordCloudStem: { id: 'wordcloud.rollover.stem', defaultMessage: 'Stem: {stem}' },
  worldCloudTerm: { id: 'wordcloud.rollover.stem', defaultMessage: 'Term: {term}' },
  wordCloudError: { id: 'wordcloud.error', defaultMessage: 'Sorry, but there aren\'t enough words to render a useful word cloud.' },
};

const DEFAULT_WORD_COUNT = 100;
const DEFAULT_WIDTH = 530;
const DEFAULT_HEIGHT = 320;
const DEFAULT_MIN_FONT_SIZE = 10;
const DEFAULT_MAX_FONT_SIZE = 30;
const DEFAULT_TEXT_COLOR = '#333333';
const DEFAULT_LINK_COLOR = '#ff0000';

class OrderedWordCloud extends React.Component {

  fontSize = (term, extent, sizeRange) => {
    const size = sizeRange.min + (((sizeRange.max - sizeRange.min)
            * (Math.log(term.tfnorm) - Math.log(extent[0]))) / (Math.log(extent[1]) - Math.log(extent[0])));
    return size;
  }

  listCloudLayout = (words, width, extent, sizeRange) => {
    const canvas = document.getElementById('canvas');   // TODO: replace with a constant
    const canvasContext2d = canvas.getContext('2d');
    let x = 0;
    if (typeof (words) === 'undefined') {
      return x;
    }
    words.attr('x', (d) => {
      const fs = this.fontSize(d, extent, sizeRange);
      canvasContext2d.font = `bold ${fs}px Lato`;    // crazy hack for IE compat, instead of simply this.getComputedTextLength()
      const metrics = canvasContext2d.measureText(d.term);
      const textLength = metrics.width;
      let lastX = x;
      if (x + textLength + 10 > width) {  // TODO: replace 10 with state property for padding
        lastX = 0;
      }
      x = lastX + textLength + (0.3 * fs);
      return lastX;
    });
    let y = -0.5 * sizeRange.max;
    let lastAdded = 0;
    const fontSizeComputer = this.fontSize; // have to do this to get the closure right
    words.attr('y', function handleY(d) { // need closure here for d3.select to work right on the element
      if (d3.select(this).attr('x') === 0) {
        const height = 1.5 * fontSizeComputer(d, extent, sizeRange);
        y += height;
        lastAdded = height;
      }
      return y;
    });
    return y + lastAdded;
  }

  render() {
    const { words, width, height, minFontSize, maxFontSize, textColor, onWordClick, linkColor, showTooltips, alreadyNormalized, fullExtent, domId } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const maxWordFreq = words.length > 0 ? words[0].count : 0;
    const enoughDataToRender = (words.length > 10) && (maxWordFreq > 10);
    const options = {
      width,
      height,
      textColor,
      linkColor,
      padding: 0,
      minFontSize,
      maxFontSize,
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
    if (textColor === undefined) {
      options.textColor = DEFAULT_TEXT_COLOR;
    }
    if (linkColor === undefined) {
      options.linkColor = DEFAULT_LINK_COLOR;
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
    // create a rollover tooltip helper
    const tooltipDiv = d3.select('body').append('div')
      .attr('class', 'viz-tooltip ordered-word-cloud-tooltip')
      .style('opacity', 0);
    // start layout calculations
    const node = ReactFauxDOM.createElement('svg');
    if (options.fullExtent === undefined) {
      options.fullExtent = d3.extent(words, d => d.tfnorm);
    }
    const innerWidth = options.width - (2 * options.padding);
    const svg = d3.select(node)
        .attr('height', options.height)
        .attr('width', options.width)
        .attr('id', domId)
        .attr('class', 'word-cloud');
    let y = options.height;
    const sizeRange = { min: options.minFontSize, max: options.maxFontSize };
    let wordNodes;
    const wordListHeight = options.height - (2 * options.padding);
    const wordWrapper = svg.append('g')
        .attr('transform', `translate(${2 * options.padding},0)`);

    while (y >= wordListHeight && sizeRange.max > sizeRange.min) {
      // Create words
      wordNodes = wordWrapper.selectAll('text')
        .data(words.slice(0, DEFAULT_WORD_COUNT), d => d.stem)
        .enter()
        .append('text') // for incoming data
          .attr('class', '')
          .classed('word', true)
          .classed('hide', d => d.display === false)
          .classed('show', d => d.display !== false)
        .attr('font-size', d => this.fontSize(d, options.fullExtent, sizeRange))
        .text(d => d.term)
        .attr('font-weight', 'bold')
        .on('mouseover', (d) => {
          if (options.showTooltips) {
            let tooltipHtml = formatMessage(localMessages.wordCloudStem, { stem: d.stem });
            tooltipHtml += '<br />';
            tooltipHtml += formatMessage(localMessages.worldCloudTerm, { term: d.term });
            tooltipHtml += '<br />';
            tooltipHtml += formatMessage(localMessages.wordCloudCount, { count: formatNumber(d.count) });
            tooltipDiv.transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltipDiv.html(tooltipHtml)
              .style('left', `${d3.event.pageX}px`)
              .style('top', `${d3.event.pageY - 48}px`);
          }
        })
        .on('mouseout', () => {
          if (options.showTooltips) {
            tooltipDiv.transition()
              .duration(500)
              .style('opacity', 0);
          }
        })
        .on('click', (d) => {
          const event = d3.event;
          if ((onWordClick !== null) && (onWordClick !== undefined)) {
            onWordClick(d, d3.select(event.target));
          }
          return null;
        });

      // Layout
      y = 0;
      const leftHeight = this.listCloudLayout(wordNodes, innerWidth, options.fullExtent, sizeRange);
      y = Math.max(y, leftHeight);
      sizeRange.max -= 1;
    }
    if (y && y < options.height) {
      svg.attr('height', y);
    }

    if (enoughDataToRender) {
      return (
        <div className="ordered-word-cloud">
          {node.toReact()}
        </div>
      );
    }
    return (<i>{formatMessage(localMessages.wordCloudError)}</i>);
  }

}

OrderedWordCloud.propTypes = {
  words: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  textColor: React.PropTypes.string,
  onWordClick: React.PropTypes.func,
  linkColor: React.PropTypes.string,
  showTooltips: React.PropTypes.bool,
  intl: React.PropTypes.object.isRequired,
  alreadyNormalized: React.PropTypes.bool,
  fullExtent: React.PropTypes.array,
  domId: React.PropTypes.string,
};

export default injectIntl(OrderedWordCloud);
