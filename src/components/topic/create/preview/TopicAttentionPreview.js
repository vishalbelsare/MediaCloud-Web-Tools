import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../common/HelpfulContainer';
import AttentionOverTimeChart from '../../../vis/AttentionOverTimeChart';
import { fetchAttentionByQuery } from '../../../../actions/topicActions';
import DataCard from '../../../common/DataCard';
import messages from '../../../../resources/messages';
import { getBrandDarkColor } from '../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.create.preview.attention.title', defaultMessage: 'Attention' },
  helpTitle: { id: 'topic.create.preview.attention.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.create.preview.attention.help.text',
    defaultMessage: '<p>This chart shows you estimated coverage of your seed query</p>',
  },
};

class TopicAttentionPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, query } = this.props;
    if (nextProps.query !== query) {
      fetchData(nextProps.query);
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

TopicAttentionPreview.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // passed in
  query: React.PropTypes.string.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  // from dispath
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.preview.matchingAttention.fetchStatus,
  total: state.topics.create.preview.matchingAttention.total,
  counts: state.topics.create.preview.matchingAttention.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (query) => {
    dispatch(fetchAttentionByQuery({ q: query }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.query);
    },
  });
}

// TODO this should not be necessary - I will just pass in the values, but am experimenting
const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
          composeAsyncContainer(
            TopicAttentionPreview
          )
        )
      )
    )
  );
