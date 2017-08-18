import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchSourceStats } from '../../../actions/sourceActions';
import StatBar from '../../common/statbar/StatBar';
import messages from '../../../resources/messages';

const localMessages = {
  nytPct: { id: 'source.summary.statbar.nyt', defaultMessage: 'With Themes' },
  geoPct: { id: 'source.summary.statbar.geo', defaultMessage: 'Geocoded' },
  collections: { id: 'source.summary.statbar.collections', defaultMessage: 'Collections' },
  isHealthy: { id: 'source.summary.statbar.isHealthy', defaultMessage: '{value, plural,\n =1{healthy}\n =0{not healthy}\n}' },
  health: { id: 'source.summary.statbar.health', defaultMessage: 'Health' },
  coveredSince: { id: 'source.summary.statbar.coveredSince', defaultMessage: 'Covered Since' },
  storyCount: { id: 'source.summary.statbar.storyCount', defaultMessage: 'Total Stories' },
};

const SourceStatInfo = (props) => {
  const { sourceId, sourceInfo } = props;
  const { formatNumber, formatDate, formatMessage } = props.intl;
  if ((sourceId === null) || (sourceId === undefined)) {
    return null;
  }
  // check some health data to see if it is missing
  let isHealthyContent;
  if (sourceInfo.is_healthy === null) {
    isHealthyContent = <FormattedMessage {...messages.unknown} />;
  } else {
    isHealthyContent = (
      <div className={`${!sourceInfo.is_healthy ? 'source-stat-health-gap' : ''}`}>
        <FormattedMessage {...localMessages.isHealthy} values={{ value: sourceInfo.is_healthy }} />
      </div>
    );
  }
  const startDate = (sourceInfo.start_date) ? formatDate(sourceInfo.start_date) : formatMessage(messages.unknown);
  return (
    <StatBar
      columnWidth={2}
      stats={[
        { message: localMessages.storyCount, data: formatNumber(sourceInfo.story_count) },
        { message: localMessages.coveredSince, data: startDate },
        { message: localMessages.health, data: isHealthyContent },
        { message: localMessages.collections, data: formatNumber(sourceInfo.collections) },
        { message: localMessages.geoPct,
          data: formatNumber(sourceInfo.geoPct, { style: 'percent', maximumFractionDigits: 2 }),
          helpTitleMsg: messages.geoHelpTitle,
          helpContentMsg: messages.geoHelpContent,
        },
        { message: localMessages.nytPct,
          data: formatNumber(sourceInfo.nytPct, { style: 'percent', maximumFractionDigits: 2 }),
          helpTitleMsg: messages.themeHelpTitle,
          helpContentMsg: messages.themeHelpContent,
        },
      ]}
    />
  );
};

SourceStatInfo.propTypes = {
  // from parent
  sourceId: PropTypes.number.isRequired,
  sourceInfo: PropTypes.object.isRequired,
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,

};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.stats.fetchStatus,
  sourceInfo: state.sources.sources.selected.stats,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceStats(ownProps.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourceStatInfo
      )
    )
  );
