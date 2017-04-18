import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { calculateTimePeriods, PAST_WEEK, PAST_MONTH, PAST_YEAR, PAST_ALL } from '../../lib/dateUtil';
import EditableWordCloudDataCard from './EditableWordCloudDataCard';

const localMessages = {
  pastWeek: { id: 'wordcloud.time.pastWeek', defaultMessage: 'past week' },
  pastMonth: { id: 'wordcloud.time.pastMonth', defaultMessage: 'past month' },
  pastYear: { id: 'wordcloud.time.pastYear', defaultMessage: 'past year' },
  all: { id: 'wordcloud.time.all', defaultMessage: 'all time' },
};

class PeriodicEditableWordCloudDataCard extends React.Component {

  saveStateAndTriggerFetch = (timePeriod) => {
    const { handleTimePeriodClick } = this.props;
    handleTimePeriodClick(calculateTimePeriods(timePeriod), timePeriod);
  }

  render() {
    const { title, words, downloadUrl, selectedTime, targetURL, onViewModeClick, helpButton, domId } = this.props;
    const timePeriods = (
      <div className="time-periods">
        <a
          tabIndex="0"
          className={selectedTime === PAST_WEEK ? 'selected' : ''}
          onClick={e => this.saveStateAndTriggerFetch(PAST_WEEK, e)}
        >
          <FormattedMessage {...localMessages.pastWeek} />
        </a>
        <a
          tabIndex="0"
          className={selectedTime === PAST_MONTH ? 'selected' : ''}
          onClick={e => this.saveStateAndTriggerFetch(PAST_MONTH, e)}
        >
          <FormattedMessage {...localMessages.pastMonth} />
        </a>
        <a
          tabIndex="0"
          className={selectedTime === PAST_YEAR ? 'selected' : ''}
          onClick={e => this.saveStateAndTriggerFetch(PAST_YEAR, e)}
        >
          <FormattedMessage {...localMessages.pastYear} />
        </a>
        <a
          tabIndex="0"
          className={selectedTime === PAST_ALL ? 'selected' : ''}
          onClick={e => this.saveStateAndTriggerFetch(PAST_ALL, e)}
        >
          <FormattedMessage {...localMessages.all} />
        </a>
      </div>
    );
    return (
      <EditableWordCloudDataCard
        words={words}
        subtitleContent={timePeriods}
        downloadUrl={`${downloadUrl}?q=${calculateTimePeriods(selectedTime)}`}
        targetURL={targetURL}
        onViewModeClick={onViewModeClick}
        domId={domId}
        width={520}
        title={title}
        helpButton={helpButton}
      />
    );
  }
}

PeriodicEditableWordCloudDataCard.propTypes = {
  // from parent
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
  itemId: React.PropTypes.string,
  downloadUrl: React.PropTypes.string,
  explore: React.PropTypes.object,
  download: React.PropTypes.func,
  helpButton: React.PropTypes.node,
  targetURL: React.PropTypes.string,
  handleTimePeriodClick: React.PropTypes.func.isRequired,
  selectedTime: React.PropTypes.string.isRequired,
    // from dispatch
  onViewModeClick: React.PropTypes.func.isRequired,
  domId: React.PropTypes.string.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      PeriodicEditableWordCloudDataCard
    )
  );
