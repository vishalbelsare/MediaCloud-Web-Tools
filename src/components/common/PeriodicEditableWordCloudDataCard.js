import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';

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

  calculateDate = (timePeriod) => {
    let currentDate = new Date();
    currentDate = currentDate.getDate();

    const all = moment().subtract(10, 'year');
    let targetPeriodStart = currentDate;
    const targetPeriodEnd = moment().format();
    const targetYear = moment().subtract(1, 'year');

    const targetMonth = moment().subtract(1, 'month');

    const targetWeek = moment().subtract(1, 'week');

    switch (timePeriod) {
      case 1: // past week
        targetPeriodStart = targetWeek;
        break;
      case 2: // past month
        targetPeriodStart = targetMonth;
        break;
      case 3:
        targetPeriodStart = targetYear;
        break;
      case 0:
        targetPeriodStart = all;
        break;
      default:
        break;
    }
    return `q='(publish_date:[${targetPeriodStart.format()} TO ${targetPeriodEnd}])'`;
  }

  render() {
    const { title, words, downloadUrl, targetURL, handleTimePeriodClick, onViewModeClick, helpButton, domId } = this.props;
    const locationWithQuery = '(publish_date:[2015-12-11T00:00:00Z TO 2016-03-18T00:00:00Z])';

    const timePeriods = (
      <div>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(this.calculateDate(1))}>
          <FormattedMessage {...localMessages.pastWeek} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(this.calculateDate(2))}>
          &nbsp;<FormattedMessage {...localMessages.pastMonth} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(this.calculateDate(3))}>
          &nbsp;<FormattedMessage {...localMessages.pastYear} />&nbsp;
        </a>
        <a tabIndex="0" onClick={() => handleTimePeriodClick(locationWithQuery)}>
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
