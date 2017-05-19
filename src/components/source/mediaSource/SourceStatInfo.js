import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchSourceStats } from '../../../actions/sourceActions';
import StatBar from '../../common/statbar/StatBar';

const localMessages = {
  nytPct: { id: 'source.summary.statbar.nyt', defaultMessage: 'With Themes' },
  geoPct: { id: 'source.summary.statbar.geo', defaultMessage: 'Geo coded' },
  collections: { id: 'source.summary.statbar.collections', defaultMessage: 'Collections' },
  isHealthy: { id: 'source.summary.statbar.isHealthy', defaultMessage: '{value, plural,\n =1{Is healthy}\n =0{Is not healthy}\n}' },
  health: { id: 'source.summary.statbar.health', defaultMessage: 'Health' },
  coveredSince: { id: 'source.summary.statbar.coveredSince', defaultMessage: 'Covered Since' },
  storyCount: { id: 'source.summary.statbar.storyCount', defaultMessage: 'Total Stories' },
};

const SourceStatInfo = (props) => {
  const { sourceId, sourceInfo } = props;
  const { formatNumber, formatDate } = props.intl;
  if ((sourceId === null) || (sourceId === undefined)) {
    return null;
  }
  const isHealthy = (
    <div className={`${!sourceInfo.isHealthy ? 'health-gap' : ''}`}>
      <FormattedMessage {...localMessages.isHealthy} values={{ value: sourceInfo.is_healthy }} />
    </div>
  );
  return (
    <StatBar
      columnWidth={2}
      stats={[
        { message: localMessages.storyCount, data: formatNumber(sourceInfo.story_count) },
        { message: localMessages.coveredSince, data: formatDate(sourceInfo.start_date) },
        { message: localMessages.health, data: isHealthy },
        { message: localMessages.collections, data: formatNumber(sourceInfo.collections) },
        { message: localMessages.geoPct, data: formatNumber(sourceInfo.geoPct, { style: 'percent' }) },
        { message: localMessages.nytPct, data: formatNumber(sourceInfo.nytPct, { style: 'percent' }) },
      ]}
    />
  );
};

SourceStatInfo.propTypes = {
  // from parent
  sourceId: React.PropTypes.number.isRequired,
  sourceInfo: React.PropTypes.object.isRequired,
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,

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
