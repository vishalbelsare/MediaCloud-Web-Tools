import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { calculateTimePeriods, PAST_WEEK, PAST_MONTH, PAST_YEAR } from '../../lib/dateUtil';
import EditableWordCloudDataCard from './EditableWordCloudDataCard';

const localMessages = {
  pastWeek: { id: 'wordcloud.time.pastWeek', defaultMessage: 'past week' },
  pastMonth: { id: 'wordcloud.time.pastMonth', defaultMessage: 'past month' },
  pastYear: { id: 'wordcloud.time.pastYear', defaultMessage: 'past year' },
  all: { id: 'wordcloud.time.all', defaultMessage: 'all' },
  editing: { id: 'wordcloud.editable.editingNotice', defaultMessage: 'You are temporarily editing this word cloud. Click words you want to hide, then use the menu to flip back into view mode and export it to SVG.' },
  edited: { id: 'wordcloud.editable.edited', defaultMessage: 'You have temporarily edited this word cloud to remove some of the words. Your changes will be lost when you leave this page.' },
  modeOrdered: { id: 'wordcloud.editable.mode.ordered', defaultMessage: 'Use Ordered Layout' },
  modeUnordered: { id: 'wordcloud.editable.mode.unordered', defaultMessage: 'Use Cloud Layout' },
};

class PeriodicEditableWordCloudDataCard extends React.Component {

  state = {
    editing: false,   // whether you are editing right now or not
    modifiableWords: null, // all the words, including a boolean display property on each
    displayOnlyWords: null, // only the words that are being displayed
    ordered: true,  // whether you are showing an ordered word cloud or circular layout word cloud
  };

  render() {
    const { title, words, downloadUrl, targetURL, handleTimePeriodClick, onViewModeClick, helpButton, domId } = this.props;
    const timePeriods = (
      <div>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(calculateTimePeriods(PAST_WEEK))}>
          <FormattedMessage {...localMessages.pastWeek} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(calculateTimePeriods(PAST_MONTH))}>
          &nbsp;<FormattedMessage {...localMessages.pastMonth} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(calculateTimePeriods(PAST_YEAR))}>
          &nbsp;<FormattedMessage {...localMessages.pastYear} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick()}>
          &nbsp;<FormattedMessage {...localMessages.all} />&nbsp;
        </a>
      </div>
    );

    return (
      <div>

        <EditableWordCloudDataCard
          words={words}
          timePeriod={timePeriods}
          downloadUrl={downloadUrl}
          targetURL={targetURL}
          onViewModeClick={onViewModeClick}
          domId={domId}
          width={520}
          title={title}
          helpButton={helpButton}
        />
      </div>
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
