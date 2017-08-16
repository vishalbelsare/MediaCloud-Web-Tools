import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicWord2Vec } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import Word2VecChart from '../../vis/Word2VecChart';

const localMessages = {
  title: { id: 'topic.words.word2vec.title', defaultMessage: 'Word Space' },
  descriptionIntro: { id: 'topic.words.word2vec.help.title', defaultMessage: 'The Word Space shows you how the most common words are used together.  Each word is bigger and dark if it is used more, and it is positioned next to other words it is used with.' },
  missingGoogleVectors: { id: 'topic.words.word2vec.missingGoogleVectors', defaultMessage: 'Sorry, but our word space data could not be generated at this time.' },
};

const WORD2VEC_DOM_ID = 'topic-summary-word2vec';

class Word2VecContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }

  render() {
    const { embeddings } = this.props;
    let content;
    if (embeddings.length > 0) {
      content = (<Word2VecChart words={embeddings} domId={WORD2VEC_DOM_ID} />);
    } else {
      content = (
        <p>
          <FormattedMessage {...localMessages.missingGoogleVectors} />
        </p>
      );
    }
    return (
      <Row>
        <Col lg={12}>
          <DataCard>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
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
  fetchStatus: state.topics.selected.summary.word2vec.fetchStatus,
  embeddings: state.topics.selected.summary.word2vec.embeddings,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId) => {
    if (topicId !== null) {
      dispatch(fetchTopicWord2Vec(topicId));
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters);
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    composeDescribedDataCard(localMessages.descriptionIntro, [messages.word2vecChartHelpText])(
      asyncContainerize(
        injectIntl(
          Word2VecContainer
        )
      )
    )
  );
