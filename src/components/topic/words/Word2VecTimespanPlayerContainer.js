import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicWord2VecTimespans } from '../../../actions/topicActions';
import Word2VecTimespanPlayer from '../../vis/Word2VecTimespanPlayer';

const localMessages = {
  title: { id: 'topic.timespanPlayer.title', defaultMessage: 'Word2Vec Animation' },
  intro: { id: 'topic.timespanPlayer.intro', defaultMessage: 'TODO: Description' },
};

class Word2VecTimespanPlayerContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if ((nextProps.filters.snapshotId !== filters.snapshotId) ||
        (nextProps.filters.focusId !== filters.focusId) ||
        (nextProps.filters.q !== filters.q)) {
      fetchData(nextProps);
    }
  }

  render() {
    const { selectedTimespan, timespanEmbeddings } = this.props;
    const { formatMessage } = this.props.intl;
    if ((selectedTimespan === undefined) || (selectedTimespan === null)) {
      return (<div />);
    }
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;

    return (
      <Grid>
        <Title render={titleHandler} />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <DataCard>
              <Word2VecTimespanPlayer
                xProperty={'w2v_x'}
                yProperty={'w2v_y'}
                initialTimespan={selectedTimespan}
                timespanEmbeddings={timespanEmbeddings}
              />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Word2VecTimespanPlayerContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  selectedTimespan: PropTypes.object,
  timespanEmbeddings: PropTypes.array.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedTimespan: state.topics.selected.timespans.selected,
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.summary.word2vecTimespans.fetchStatus,
  timespanEmbeddings: state.topics.selected.summary.word2vecTimespans.list,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicWord2VecTimespans(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        filters: stateProps.filters,
        topicId: stateProps.topicId,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        Word2VecTimespanPlayerContainer
      )
    )
  );
