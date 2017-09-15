import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import StatBar from '../common/statbar/StatBar';
import messages from '../../resources/messages';
import { fetchSystemStats } from '../../actions/systemActions';
import { humanReabableNumber } from '../../lib/stringUtil';

const SystemStatsContainer = (props) => {
  const { formatNumber } = props.intl;
  const { total_stories,
          // total_downloads,
          total_sentences,
          active_crawled_media,
          // active_crawled_feeds,
          daily_stories,
          // daily_downloads,
  } = props.stats;

  return (
    <div className="system-stats">
      <StatBar
        columnWidth={3}
        stats={[
          { message: messages.totalStoriesStat, data: humanReabableNumber(total_stories, 3, formatNumber) },
          // { message: messages.totalDownloadsStat, data: humanReabableNumber(total_downloads, 3) },
          { message: messages.totalSentencesStat, data: humanReabableNumber(total_sentences, 3, formatNumber) },
          { message: messages.crawledMediaStat, data: humanReabableNumber(active_crawled_media, 2, formatNumber) },
          // { message: messages.crawledFeedsStat, data: humanReabableNumber(active_crawled_feeds, 3) },
          { message: messages.dailyStoriesStat, data: humanReabableNumber(daily_stories, 3, formatNumber) },
          // { message: messages.dailyDownloadsStat, data: humanReabableNumber(daily_downloads, 3) },
        ]}
      />
    </div>
  );
};

SystemStatsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.stats.fetchStatus,
  stats: state.system.stats.stats,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSystemStats());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SystemStatsContainer
      )
    )
  );
