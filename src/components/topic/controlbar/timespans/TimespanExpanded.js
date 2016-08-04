import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import VisualTimespanSelector from './VisualTimespanSelector';
import d3 from 'd3';

function filterByPeriod(timespans, period) {
  return timespans.filter((t) => t.period === period);
}

class TimespanExpanded extends React.Component {

  setPeriod = (period) => {
    const { onPeriodSelected } = this.props;
    onPeriodSelected(period);
  }

  setPeriodToOverall = (evt) => {
    evt.preventDefault();
    this.setPeriod('overall');
  }

  setPeriodToMonthly = (evt) => {
    evt.preventDefault();
    this.setPeriod('monthly');
  }

  setPeriodToWeekly = (evt) => {
    evt.preventDefault();
    this.setPeriod('weekly');
  }

  setPeriodToCustom = (evt) => {
    evt.preventDefault();
    this.setPeriod('custom');
  }

  fireTimespanSelected = (timespan) => {
    const { onTimespanSelected } = this.props;
    onTimespanSelected(timespan.timespans_id);
  }

  render() {
    const { timespans, selectedTimespan, selectedPeriod, onCollapse } = this.props;
    const oldestTimespanStart = d3.min(timespans.map((t) => t.startDateMoment.toDate()));
    const latestTimespanEnd = d3.max(timespans.map((t) => t.endDateMoment.toDate()));
    return (
      <Grid>
        <Row>
          <Col lg={2} md={2} sm={0} className="period-controls">
            <a href="#" onClick={this.setPeriodToOverall}>Overall</a>
            <a href="#" onClick={this.setPeriodToMonthly}>Monthly</a>
            <a href="#" onClick={this.setPeriodToWeekly}>Weekly</a>
            <a href="#" onClick={this.setPeriodToCustom}>Custom</a>
          </Col>
          <Col lg={8} md={8} sm={6} className="center">
            {selectedTimespan.start_date.substr(0, 10)} to {selectedTimespan.end_date.substr(0, 10)}
          </Col>
          <Col lg={2} md={2} sm={6} >
            <a href="#" className="toggle-control" onClick={onCollapse}>Hide Timespans</a>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
          <VisualTimespanSelector
            timespans={filterByPeriod(timespans, selectedPeriod)}
            startDate={oldestTimespanStart}
            endDate={latestTimespanEnd}
            onTimespanSelected={this.fireTimespanSelected}
            selectedTimespan={selectedTimespan}
          />
          </Col>
        </Row>
      </Grid>
    );
  }
}

TimespanExpanded.propTypes = {
  // from parent
  timespans: React.PropTypes.array.isRequired,
  selectedTimespan: React.PropTypes.object.isRequired,
  onCollapse: React.PropTypes.func.isRequired,
  onTimespanSelected: React.PropTypes.func.isRequired,
  selectedPeriod: React.PropTypes.string.isRequired,
  onPeriodSelected: React.PropTypes.func.isRequired,
};

export default injectIntl(TimespanExpanded);
