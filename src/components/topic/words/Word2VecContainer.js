import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicWord2Vec } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'topic.words.word2vec.title', defaultMessage: 'Word2Vec' },
  descriptionIntro: { id: 'topic.words.word2vec.help.title', defaultMessage: 'W2V help text here...' },
};

// helper functions here

class Word2VecContainer extends React.Component {

  // TODO: look into what componentWillReceiveProps method is supposed to do...left-over code from other component
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }

  render() {
    return (
      <Row>
        <Col lg={12}>
          <DataCard>
            <h2><FormattedMessage {...localMessages.title} /></h2>
          </DataCard>
        </Col>
      </Row>
    );
  }
}

Word2VecContainer.propTypes = {
  // from parent
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  embeddings: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word2vec.fetchStatus,
  embeddings: state.topics.selected.word2vec.embeddings,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId) => {
    if (topicId !== null) {
      dispatch(fetchTopicWord2Vec(topicId));
    }
  },
});

// Not exactly sure what this does...
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    // TODO: change messages.attentionchart to message.w2vcharthelp, add help text...
    composeDescribedDataCard(localMessages.descriptionIntro, [messages.attentionChartHelpText])(
      asyncContainerize(
        injectIntl(
          Word2VecContainer
        )
      )
    )
  );
