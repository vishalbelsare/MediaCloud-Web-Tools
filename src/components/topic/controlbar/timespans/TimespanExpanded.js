import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import * as d3 from 'd3';
import VisualTimespanSelector from './VisualTimespanSelector';

const localMessages = {
  timespansOverall: { id: 'timespans.overall', defaultMessage: 'Overall' },
  timespansMonthly: { id: 'timespans.overall', defaultMessage: 'Monthly' },
  timespansWeekly: { id: 'timespans.overall', defaultMessage: 'Weekly' },
  timespansCustom: { id: 'timespans.overall', defaultMessage: 'Custom' },
  timespansHide: { id: 'timespans.hide', defaultMessage: 'Hide Timespans' },
};

function filterByPeriod(timespans, period) {
  return timespans.filter((t) => t.period === period);
}

class TimespanExpanded extends React.Component {

  componentWillMount = () => {
    const { selectedTimespan } = this.props;
    this.setPeriod(selectedTimespan.period);
  }

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
    onTimespanSelected(timespan);
  }

  render() {
    const { timespans, selectedTimespan, selectedPeriod, onCollapse } = this.props;
    const oldestTimespanStart = d3.min(timespans.map((t) => t.startDateObj));
    const latestTimespanEnd = d3.max(timespans.map((t) => t.endDateObj));
    return (
      <Grid>
        <Row>
          <Col lg={2} md={2} sm={0} className="period-controls">
            <a href="#see-overall-timspans" onClick={this.setPeriodToOverall}>
              <FormattedMessage {...localMessages.timespansOverall} />
            </a>
            <a href="#see-monthly-timspans" onClick={this.setPeriodToMonthly}>
              <FormattedMessage {...localMessages.timespansMonthly} />
            </a>
            <a href="#see-weekly-timspans" onClick={this.setPeriodToWeekly}>
              <FormattedMessage {...localMessages.timespansWeekly} />
            </a>
            <a href="#see-custom-timspans" onClick={this.setPeriodToCustom}>
              <FormattedMessage {...localMessages.timespansCustom} />
            </a>
          </Col>
          <Col lg={8} md={8} sm={6} className="center">
            {selectedTimespan.start_date.substr(0, 10)} to {selectedTimespan.end_date.substr(0, 10)}
          </Col>
          <Col lg={2} md={2} sm={6} >
            <a href="#hide-timespans" className="toggle-control" onClick={onCollapse}>
              <FormattedMessage {...localMessages.timespansHide} />
            </a>
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
