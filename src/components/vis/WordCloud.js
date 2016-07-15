import React from 'react';
import d3 from 'd3';
import d3LayoutCloud from 'd3-cloud';
import ReactFauxDOM from 'react-faux-dom';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 300;
const DEFAULT_MAX_FONT_SIZE = 32;
const DEFAULT_TEXT_COLOR = '#333333';
const DEFAULT_LINK_COLOR = '#000000';

class WordCloud extends React.Component {

  render() {
    const { words, width, height, maxFontSize, textColor, onWordClick, linkColor } = this.props;
    const options = {
      width,
      height,
      maxFontSize,
      textColor,
      linkColor,
    };
    if (width !== null) {
      options.width = DEFAULT_WIDTH;
    }
    if (height !== null) {
      options.height = DEFAULT_HEIGHT;
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
    const node = ReactFauxDOM.createElement('svg');
    const counts = words.map(({ count }) => count);
    const max = d3.max(counts);
    const slope = options.maxFontSize / Math.log(max);
    // get list of all words and sizes
    const wordList = words.map((w) => ({
      text: w.term,
      size: slope * Math.log(w.count),
    }));
    // create wordcloud
    d3LayoutCloud().size([options.width, options.height])
    .words(wordList)
    .rotate(() => (~~(Math.random() * 1) * 90))
    .font('Arial')
    .fontSize((d) => d.size)
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
        .enter().append('text')
        .attr('font-size', (d) => `${d.size}px`)
        .attr('fill', options.textColor)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('transform', (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    })
    .start();
    if (this.onWordClick !== undefined) {
      node.selectAll('text')
        .on('mouseover', () => {
          d3.select(this).attr('fill', this.options.linkColor)
            .attr('cursor', 'pointer');
        })
        .on('mouseout', () => {
          d3.select(this).attr('fill', this.options.textColor)
            .attr('cursor', 'default');
        })
        .on('click', (d) => {
          onWordClick(d);
        });
    }
    return node.toReact();
  }

}

WordCloud.propTypes = {
  words: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  textColor: React.PropTypes.string,
  onWordClick: React.PropTypes.func,
  linkColor: React.PropTypes.string,
};

export default WordCloud;
