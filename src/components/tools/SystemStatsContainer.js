import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../common/AsyncContainer';
import StatBar from '../common/statbar/StatBar';
import messages from '../../resources/messages';
import { fetchSystemStats } from '../../actions/sourceActions';

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

  function abbreviateNumber(number, numSigFigs) {
    const pow = Math.round(number).toString().length;

    if (pow > 12) {
      return '>1 trillion';
    }
    if (pow >= 10 && pow <= 12) {
      const abbrev = formatNumber(number / 1000000000, { maximumSignificantDigits: numSigFigs });
      return abbrev.concat(' billion');
    }
    if (pow >= 7 && pow <= 9) {
      const abbrev = formatNumber(number / 1000000, { maximumSignificantDigits: numSigFigs });
      return abbrev.concat(' million');
    }
    if (pow >= 4 && pow <= 6) {
      const abbrev = formatNumber(number / 1000, { maximumSignificantDigits: numSigFigs });
      return abbrev.concat(' thousand');
    }

    return formatNumber(number);
  }

  return (
    <div className="system-stats">
      <StatBar
        columnWidth={3}
        stats={[
          { message: messages.totalStoriesStat, data: abbreviateNumber(total_stories, 3) },
          // { message: messages.totalDownloadsStat, data: abbreviateNumber(total_downloads, 3) },
          { message: messages.totalSentencesStat, data: abbreviateNumber(total_sentences, 3) },
          { message: messages.crawledMediaStat, data: abbreviateNumber(active_crawled_media, 2) },
          // { message: messages.crawledFeedsStat, data: abbreviateNumber(active_crawled_feeds, 3) },
          { message: messages.dailyStoriesStat, data: abbreviateNumber(daily_stories, 3) },
          // { message: messages.dailyDownloadsStat, data: abbreviateNumber(daily_downloads, 3) },
        ]}
      />
    </div>
  );
};

SystemStatsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  stats: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
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
