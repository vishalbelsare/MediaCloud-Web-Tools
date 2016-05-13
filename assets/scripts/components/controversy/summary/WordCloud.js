import React from 'react';
import d3 from 'd3';
import d3LayoutCloud from 'd3-cloud';
import ReactFauxDOM from 'react-faux-dom';

class WordCloud extends React.Component {

  render() {
    const { words } = this.props;

    const node = ReactFauxDOM.createElement('svg');
    const maxSize = 32;
    const width = 700;
    const height = 400;
    const counts = words.map(({ count }) => count);
    //const min = d3.min(counts);
    const max = d3.max(counts);
    const slope = 32 / Math.log(max);
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
        const svg = d3.select(node)
        .attr('width', width).attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(wordsAsData)
        .enter().append('text')
        .attr('font-size', (d) => `${d.size}px`)
        .attr('fill', '#ff0000')
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
};

export default WordCloud;
