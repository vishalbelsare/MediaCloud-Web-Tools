import React from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

const DEFAULT_WIDTH = 550;
const DEFAULT_HEIGHT = 300;
const DEFAULT_MIN_FONT_SIZE = 10;
const DEFAULT_MAX_FONT_SIZE = 24;
const DEFAULT_TEXT_COLOR = '#333333';
const DEFAULT_LINK_COLOR = '#000000';

class OrderedWordCloud extends React.Component {

  fontSize = (term, extent, sizeRange) => {
    const size = sizeRange.min + (sizeRange.max - sizeRange.min)
            * (Math.log(term.tfnorm) - Math.log(extent[0])) / (Math.log(extent[1]) - Math.log(extent[0]));
    return size;
  }

  listCloudLayout = (words, width, extent, sizeRange) => {
    const canvas = document.getElementById('canvas');   // TODO: replace with a constant
    const canvasContext2d = canvas.getContext('2d');
    let x = 0;
    if (typeof(words) === 'undefined') {
      return x;
    }
    words.attr('x', d => {
      const fs = this.fontSize(d, extent, sizeRange);
      canvasContext2d.font = `bold ${fs}px Roboto`;    // crazy hack for IE compat, instead of simply this.getComputedTextLength()
      const metrics = canvasContext2d.measureText(d.term);
      const textLength = metrics.width;
      let lastX = x;
      if (x + textLength + 10 > width) {  // TODO: replace 10 with state property for padding
        lastX = 0;
      }
      x = lastX + textLength + 0.3 * fs;
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
    const { words, width, height, minFontSize, maxFontSize, textColor, onWordClick, linkColor } = this.props;
    const options = {
      width,
      height,
      textColor,
      linkColor,
      padding: 0,
      minFontSize,
      maxFontSize,
    };
    if (width !== null) {
      options.width = DEFAULT_WIDTH;
    }
    if (height !== null) {
      options.height = DEFAULT_HEIGHT;
    }
    if (minFontSize !== null) {
      options.minFontSize = DEFAULT_MIN_FONT_SIZE;
    }
    if (maxFontSize !== null) {
      options.maxFontSize = DEFAULT_MAX_FONT_SIZE;
    }
    if (textColor !== null) {
      options.textColor = DEFAULT_TEXT_COLOR;
    }
    // add in tf normalization
    const allSum = d3.sum(words, term => parseInt(term.count, 10));
    words.forEach((term, idx) => { words[idx].tfnorm = term.count / allSum; });
    // start layout calculations
    const node = ReactFauxDOM.createElement('svg');
    const fullExtent = d3.extent(words, d => d.tfnorm);
    const innerWidth = (options.width - 2 * options.padding);
    const svg = d3.select(node)
        .attr('height', options.height)
        .attr('width', options.width);
    let y = options.height;
    const sizeRange = { min: options.minFontSize, max: options.maxFontSize };
    let wordNodes;
    const wordListHeight = options.height - 2 * options.padding;
    const wordWrapper = svg.append('g')
        .attr('transform', `translate(${2 * options.padding},0})`);
    while (y >= wordListHeight && sizeRange.max > sizeRange.min) {
      // Create words
      wordNodes = wordWrapper.selectAll('.word')
        .data(words, d => d.stem)
        .enter()
        .append('text').classed('word', true).classed('left', true)
        .attr('font-size', d => this.fontSize(d, fullExtent, sizeRange))
        .text(d => d.term)
        .attr('font-weight', 'bold');
      // Layout
      y = 0;
      const leftHeight = this.listCloudLayout(wordNodes, innerWidth, fullExtent, sizeRange);
      y = Math.max(y, leftHeight);
      sizeRange.max = sizeRange.max - 1;
    }
    if (y < options.height) {
      svg.attr('height', y);
    }
    /* d3.selectAll('.word')
        .on('mouseover', function () {
            d3.select(this).attr('fill', that.config.linkColor)
            .attr('cursor','pointer');
        })
        .on('mouseout', function () {
            var color = '#000';
            if (d3.select(this).classed('left')) {
                color = that.leftModel.getColor();
            }
            if (d3.select(this).classed('right')) {
                color = that.rightModel.getColor();
            }
            d3.select(this).attr('fill', color)
            .attr('cursor','default');
        });
    d3.selectAll('.left.word')
        .on('click', this.refineBothQueries);*/
    return node.toReact();
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
};

export default OrderedWordCloud;
