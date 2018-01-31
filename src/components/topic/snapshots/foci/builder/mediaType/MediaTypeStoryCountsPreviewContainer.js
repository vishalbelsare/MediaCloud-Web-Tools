import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import { fetchCreateFocusMediaTypeStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PackedBubbleChart from '../../../../../vis/PackedBubbleChart';
import mapD3Top10Colors from '../../../../../../lib/colorUtil';

const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewTopCountriesStoriesCounts';

const localMessages = {
  title: { id: 'topic.snapshot.topCountries.storyCount.title', defaultMessage: 'Stories By Media Type' },
  intro: { id: 'topic.snapshot.topCountries.storyCount.intro', defaultMessage: 'Stories about most-talked-about media types' },
};

class MediaTypeStoryCountsPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { topicId, mediaTypeSelected, fetchData } = this.props;
    if (nextProps.mediaTypeSelected !== mediaTypeSelected) {
      fetchData(topicId, nextProps.mediaTypeSelected);
    }
  }
  render() {
    const { counts } = this.props;
    const { formatNumber } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = counts.map((info, idx) => ({
        value: info.count,
        fill: mapD3Top10Colors(idx),
        rolloverText: `${info.label}: ${formatNumber(info.count)}`,
      }));
      content = (<PackedBubbleChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={700}
        padding={30}
      />);
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        {content}
      </DataCard>
    );
  }
}

MediaTypeStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaTypeSelected: PropTypes.number.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.mediaTypeStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.mediaTypeStoryCounts.story_counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, mediaTypeSelected) => {
    dispatch(fetchCreateFocusMediaTypeStoryCounts(topicId, { mediaTypeSelected }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.mediaTypeSelected);
    },

  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        MediaTypeStoryCountsPreviewContainer
      )
    )
  );
