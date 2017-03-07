import React from 'react';
import * as d3 from 'd3';
import d3LayoutCloud from 'd3-cloud';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WORD_COUNT = 100;
const DEFAULT_WIDTH = 530;
const DEFAULT_HEIGHT = 300;
const DEFAULT_MAX_FONT_SIZE = 36;
const DEFAULT_MIN_FONT_SIZE = 8;
const DEFAULT_TEXT_COLOR = '#333333';
const DEFAULT_LINK_COLOR = '#000000';

const localMessages = {
  wordCloudCount: { id: 'wordcloud.rollover.count', defaultMessage: 'Uses: {count}' },
  wordCloudStem: { id: 'wordcloud.rollover.stem', defaultMessage: 'Stem: {stem}' },
  worldCloudTerm: { id: 'wordcloud.rollover.stem', defaultMessage: 'Term: {term}' },
  wordCloudError: { id: 'wordcloud.error', defaultMessage: 'Sorry, but there aren\'t enough words to render a useful word cloud.' },
};

class WordCloud extends React.Component {

  render() {
    const { words, width, height, maxFontSize, minFontSize, textColor, showTooltips, onWordClick, linkColor, domId } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxFontSize,
      minFontSize,
      textColor,
      linkColor,
      showTooltips,
    };
    if (width !== null) {
      options.width = DEFAULT_WIDTH;
    }
    if (height !== null) {
      options.height = DEFAULT_HEIGHT;
    }
    if (minFontSize === undefined) {
      options.minFontSize = DEFAULT_MIN_FONT_SIZE;
    }
    if (maxFontSize !== null) {
      options.maxFontSize = DEFAULT_MAX_FONT_SIZE;
    }
    if (textColor !== null) {
      options.textColor = DEFAULT_TEXT_COLOR;
    }
    if (linkColor !== null) {
      options.linkColor = DEFAULT_LINK_COLOR;
    }
    if (showTooltips === undefined) {
      options.showTooltips = false;
    }
    // create a rollover tooltip helper
    const tooltipDiv = d3.select('body').append('div')
      .attr('class', 'viz-tooltip word-cloud-tooltip')
      .style('opacity', 0);
    // start layout
    const node = ReactFauxDOM.createElement('svg');
    const counts = words.map(({ count }) => count);
    const max = d3.max(counts);
    const slope = options.maxFontSize / Math.log(max);
    // get list of all words and sizes
    const wordList = words.slice(0, DEFAULT_WORD_COUNT).map(w => ({
      text: w.term,
      stem: w.stem,
      size: slope * Math.log(w.count),
      display: w.display,
    }));
    // create wordcloud
    d3LayoutCloud().size([options.width, options.height])
    .words(wordList)
    .rotate(() => (~~(Math.random() * 1) * 90))
    .font('Arial')
    .fontSize(d => d.size)
    .on('end', (wordsAsData) => {
      // Black and white
      // var fill = d3.scale.linear().domain([0,100]).range(['black','white']);
      // Colors
      d3.select(node)
        .attr('width', options.width).attr('height', options.height)
        .append('g')
        .attr('transform', `translate(${options.width / 2},${options.height / 2})`)
        .selectAll('text')
        .data(wordsAsData)
        .enter()
          .append('text')
            .attr('font-family', 'Lato, Helvetica, sans')
            .attr('font-size', d => `${d.size}px`)
            .attr('fill', options.textColor)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    })
    .start();
    if (this.onWordClick !== undefined) {
      node.selectAll('text')
        .on('mouseover', (d) => {
          d3.select(this).attr('fill', this.options.linkColor)
            .attr('cursor', 'pointer');
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
          d3.select(this).attr('fill', this.options.textColor)
            .attr('cursor', 'default');
          if (options.showTooltips) {
            tooltipDiv.transition()
              .duration(500)
              .style('opacity', 0);
          }
        })
        .on('click', (d) => {
          onWordClick(d);
        });
    }
    return (
      <div className="editable-word-cloud" id={domId}>
        {node.toReact()}
      </div>
    );
  }

}

WordCloud.propTypes = {
  words: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  textColor: React.PropTypes.string,
  onWordClick: React.PropTypes.func,
  linkColor: React.PropTypes.string,
  showTooltips: React.PropTypes.bool,
  domId: React.PropTypes.string,
  // from compositon chain
  intl: React.PropTypes.object.isRequired,
//  alreadyNormalized: React.PropTypes.bool,
//  fullExtent: React.PropTypes.array,
};

export default injectIntl(WordCloud);
