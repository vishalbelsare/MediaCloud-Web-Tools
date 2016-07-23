import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../resources/messages';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

function filterByPeriod(timespans, period){
  return timespans.filter( (t) => t.period === period );
}

class TimespanExpanded extends React.Component {

  setPeriod = (period) => {
    const { onPeriodSelected } = this.props;
    onPeriodSelected(period);
  }

  setPeriodToOverall = (evt) => {
    evt.preventDefault();
    this.setPeriod('overall')
  }

  setPeriodToMonthly = (evt) => {
    evt.preventDefault();
    this.setPeriod('monthly')
  }

  setPeriodToWeekly = (evt) => {
    evt.preventDefault();
    this.setPeriod('weekly')
  }

  setPeriodToCustom = (evt) => {
    evt.preventDefault();
    this.setPeriod('custom')
  }

  render() {
    const { timespans, selectedTimespan, selectedPeriod, onCollapse } = this.props;
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
          {filterByPeriod(timespans, selectedPeriod).map(t =>
            <p key={t.timespans_id}>{t.start_date.substr(0, 10)} to {t.end_date.substr(0, 10)}</p>
          )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

TimespanExpanded.propTypes = {
  timespans: React.PropTypes.array.isRequired,
  selectedTimespan: React.PropTypes.object.isRequired,
  onCollapse: React.PropTypes.func.isRequired,
  onTimespanSelected: React.PropTypes.func.isRequired,
  selectedPeriod: React.PropTypes.string.isRequired,
  onPeriodSelected: React.PropTypes.func.isRequired,
};

export default injectIntl(TimespanExpanded);
