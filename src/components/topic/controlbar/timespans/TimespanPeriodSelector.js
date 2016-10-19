import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  timespansOverall: { id: 'timespans.overall', defaultMessage: 'Overall' },
  timespansMonthly: { id: 'timespans.overall', defaultMessage: 'Monthly' },
  timespansWeekly: { id: 'timespans.overall', defaultMessage: 'Weekly' },
  timespansCustom: { id: 'timespans.overall', defaultMessage: 'Custom' },
};

class TimespanPeriodSelector extends React.Component {

  linkToPeriod = (name, msg) => (
    <a
      href={`#see-${name}-timespans"`}
      onClick={(evt) => { evt.preventDefault(); this.selectPeriod(name); }}
      className={(this.props.selectedPeriod === name) ? 'greyed selected' : 'greyed unselected'}
    >
      <FormattedMessage {...msg} />
    </a>
  )

  selectPeriod = (period) => {
    const { onPeriodSelected } = this.props;
    onPeriodSelected(period);
  }

  render() {
    // TODO: unselected link is grey, rollover makes it green with a dotted line underneath, active is green
    // (make show/hide act same as unselected)
    return (
      <div className="timespan-period-selector">
        { this.linkToPeriod('overall', localMessages.timespansOverall) }
        { this.linkToPeriod('weekly', localMessages.timespansWeekly) }
        { this.linkToPeriod('monthly', localMessages.timespansMonthly) }
        { this.linkToPeriod('custom', localMessages.timespansCustom) }
      </div>
    );
  }
}

TimespanPeriodSelector.propTypes = {
  // from parent
  selectedPeriod: React.PropTypes.string.isRequired,
  onPeriodSelected: React.PropTypes.func.isRequired,
};

export default
  injectIntl(
    TimespanPeriodSelector
  );
