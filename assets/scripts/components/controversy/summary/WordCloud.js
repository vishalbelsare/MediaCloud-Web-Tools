import React from 'react';
import d3 from 'd3';
import d3LayoutCloud from 'd3-cloud';
import ReactFauxDOM from 'react-faux-dom';

class WordCloud extends React.Component {

  render() {
    const { words, width, height, maxFontSize, textColor } = this.props;

    const node = ReactFauxDOM.createElement('svg');
    const counts = words.map(({ count }) => count);
    const max = d3.max(counts);
    const slope = maxFontSize / Math.log(max);
    // get list of all words and sizes
    const wordList = words.map((w) => ({
      text: w.term,
      size: slope * Math.log(w.count),
    }));
    // create wordcloud
    d3LayoutCloud().size([width, height])
    .words(wordList)
    .rotate(() => (~~(Math.random() * 1) * 90))
    .font('Arial')
    .fontSize((d) => d.size)
    .on('end', (wordsAsData) => {
      // Black and white
      // var fill = d3.scale.linear().domain([0,100]).range(['black','white']);
      // Colors
      d3.select(node)
        .attr('width', width).attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(wordsAsData)
        .enter().append('text')
        .attr('font-size', (d) => `${d.size}px`)
        .attr('fill', textColor)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('transform', (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    })
    .start();

    return node.toReact();
  }

}

WordCloud.propTypes = {
  words: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  maxFontSize: React.PropTypes.number.isRequired,
  textColor: React.PropTypes.string.isRequired,
};

export default WordCloud;
