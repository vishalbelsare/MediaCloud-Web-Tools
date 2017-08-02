import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

const PADDING = 10;

class Sunburst extends React.Component {
  buildTree = () => {

  }

  render() {
    const { tree, width, height, domId } = this.props;
    const radius = (Math.min(width, height) / 2) - PADDING;

    const formatNumber = d3.format(',.2f');

    const x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);

    const y = d3.scaleSqrt()
        .range([0, radius]);

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const partition = d3.partition();

    const arc = d3.arc()
        .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
        .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
        .innerRadius(d => Math.max(0, y(d.y0)))
        .outerRadius(d => Math.max(0, y(d.y1)));

    // need to create a fake DOM node to use here
    const rootNode = ReactFauxDOM.createElement('div');
    const div = d3.select(rootNode).append('div').attr('id', 'sunburst-chart-wrapper');
    const svg = div.append('svg:svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', domId)
      .append('g')
        .attr('transform', `translate(${width / 2},${height * 0.52})`);

    // show trail and details
    const handleMouseOver = (d) => {
      let percentageString = `${formatNumber(d.data.count * 100)} %`;
      if (d.count < 0.1) {
        percentageString = '< 0.1%';
      }
      d3.select('#sunburst-percentage')
          .text(percentageString);
      d3.select('#sunburst-name')
          .text(d.data.name);
      d3.select('#sunburst-explanation')
          .style('visibility', '');
      // updateBreadcrumbs(d.path.split('/'), percentageString);
    };

    // remove trail and details
    const handleMouseLeave = () => {
      // Hide the breadcrumb trail
      d3.select('#trail')
          .style('visibility', 'hidden');
      d3.select('#sunburst-explanation')
          .style('visibility', 'hidden');
    };

    const treeRoot = d3.hierarchy(tree);
    treeRoot.sum(d => d.count);
    svg.selectAll('path')
        .data(partition(treeRoot).descendants())
      .enter().append('path')
        .attr('display', d => (d.depth ? null : 'none')) // hide inner ring
        .attr('class', d => (d.depth ? 'arc' : 'arc arc-center')) // label inner ring
        .attr('d', arc)
        .style('fill', d => color((d.children ? d : d.parent).data.name))
        .style('opacity', 1)
        .on('mouseover', handleMouseOver)
        .on('mouseleave', handleMouseLeave)
      .append('title')
        .text(d => `${d.data.name}: ${formatNumber(d.value)}`);

    const content = rootNode.toReact();

    return (
      <div className="sunburst-chart" style={{ width, height }}>
        <div id="sunburst-explanation" style={{ top: height * 0.95, left: (width * 0.86) / 2 }}>
          <div id="sunburst-percentage" />
          <div id="sunburst-name" />
        </div>
        {content}
      </div>
    );
  }
}

Sunburst.propTypes = {
  // from parent
  tree: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  domId: PropTypes.string.isRequired,
};

export default Sunburst;
