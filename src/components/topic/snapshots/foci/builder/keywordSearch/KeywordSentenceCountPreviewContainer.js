import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../../../../vis/AttentionOverTimeChart';
import { fetchCreateFocusKeywordAttention } from '../../../../../../actions/topicActions';
import messages from '../../../../../../resources/messages';
import DataCard from '../../../../../common/DataCard';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.snapshot.keywords.attention.title', defaultMessage: 'Attention' },
  helpTitle: { id: 'topic.snapshot.keywords.attention.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.snapshot.keywords.attention.help.text',
    defaultMessage: '<p>This chart shows you the coverage within this Topic that matches your keyword.</p>',
  },
};

class KeywordSentenceCountPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { keywords, fetchData } = this.props;
    if (nextProps.keywords !== keywords) {
      fetchData(nextProps.keywords);
    }
  }
  render() {
    const { total, counts, helpButton } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
        />
      </DataCard>
    );
  }
}

KeywordSentenceCountPreviewContainer.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // passed in
  topicId: React.PropTypes.number.isRequired,
  keywords: React.PropTypes.string.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingAttention.fetchStatus,
  total: state.topics.selected.focalSets.create.matchingAttention.total,
  counts: state.topics.selected.focalSets.create.matchingAttention.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    dispatch(fetchCreateFocusKeywordAttention(ownProps.topicId, { q: keywords }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.keywords);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          KeywordSentenceCountPreviewContainer
        )
      )
    )
  );
