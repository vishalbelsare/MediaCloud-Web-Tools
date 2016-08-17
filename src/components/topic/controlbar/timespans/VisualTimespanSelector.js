import React from 'react';
import { injectIntl } from 'react-intl';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import Dimensions from 'react-dimensions';
import { getBrandDarkColor } from '../../../../styles/colors';

class VisualTimespanSelector extends React.Component {

  formattedDate(d) {
    const { formatDate } = this.props.intl;
    return formatDate(d, { year: '2-digit', month: 'numeric', day: 'numeric' });
  }

  render() {
    const { containerWidth, timespans, selectedTimespan, onTimespanSelected, startDate, endDate } = this.props;
    const horizontalPadding = 30;
    const verticalPadding = 20;
    const width = containerWidth - horizontalPadding;
    const height = 60;
    const node = ReactFauxDOM.createElement('svg');
    const dateRange = [startDate, endDate];
    const xScale = d3.scaleUtc().domain(dateRange).range([0, width - (horizontalPadding * 2)]);
    const svg = d3.select(node)
      .attr('class', 'visual-timespan-selector')
      .attr('height', height)
      .attr('width', width);
    const xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(10)
      .tickFormat(d => this.formattedDate(d));
    const chartWrapper = svg.append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${horizontalPadding},${verticalPadding})`);
    // add the axis
    chartWrapper.append('g')
      .attr('class', 'xaxis')
      .attr('transform', 'translate(0,10)')
      .call(xAxis);
    chartWrapper.selectAll('.xaxis text')
      .attr('transform', 'translate(0,10)');
    // add the timespans
    chartWrapper.append('g')
      .attr('class', 'data')
      .selectAll('.timespan')
        .data(timespans)
        .enter()
          .append('rect')
            .attr('class', 'timespan')
            .attr('x', t => xScale(t.startDateMoment.toDate()))
            .attr('y', 0)
            .attr('data-id', t => t.timespan_id)
            .attr('data-start', t => xScale(t.startDateMoment.toDate()))
            .attr('data-end', t => xScale(t.endDateMoment.toDate()))
            .attr('width', t => (xScale(t.endDateMoment.toDate()) - xScale(t.startDateMoment.toDate())))
            .attr('height', 20)
            .on('click', onTimespanSelected)
            .append('svg:title')
              .text(t => `${this.formattedDate(t.startDateMoment.toDate())}-${this.formattedDate(t.endDateMoment.toDate())}`);
    // highlight the selected timespan
    if (timespans.includes(selectedTimespan)) {
      chartWrapper
        .append('g')
        .attr('class', 'selected-data')
          .append('rect')
            .attr('class', 'timespan')
            .attr('x', xScale(selectedTimespan.startDateMoment.toDate()))
            .attr('y', 0)
            .attr('data-id', selectedTimespan.timespan_id)
            .attr('data-start', xScale(selectedTimespan.startDateMoment.toDate()))
            .attr('data-end', xScale(selectedTimespan.endDateMoment.toDate()))
            .attr('width', xScale(selectedTimespan.endDateMoment.toDate()) - xScale(selectedTimespan.startDateMoment.toDate()))
            .attr('height', 20)
            .attr('style', `fill:${getBrandDarkColor()};fill-opacity:0.9`)
            .on('click', onTimespanSelected)
            .append('svg:title')
              .text(`${this.formattedDate(selectedTimespan.startDateMoment.toDate())}-${this.formattedDate(selectedTimespan.endDateMoment.toDate())}`);
    }
    return (
      <div>
        {node.toReact()}
      </div>
    );
  }

}

VisualTimespanSelector.propTypes = {
  // from parent
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
  timespans: React.PropTypes.array.isRequired,
  onTimespanSelected: React.PropTypes.func,
  selectedTimespan: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from Dimensions helper
  containerWidth: React.PropTypes.number,
};

export default
  injectIntl(
    Dimensions()(VisualTimespanSelector)
  );
