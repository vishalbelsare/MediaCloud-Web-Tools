import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncWidget from '../util/composeAsyncWidget';
import TopicList from './TopicList';
import { fetchTopicsList } from '../../actions/topicActions';

const localMessages = {
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'Recent Topics' },
};

class TopicListContainer extends React.Component {
  render() {
    const { topics } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(localMessages.topicsListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2>{title}</h2>
              <TopicList topics={topics} />;
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

TopicListContainer.propTypes = {
  // from state
  topics: React.PropTypes.array.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.all.fetchStatus,
  topics: state.topics.all.list,
});

const mapDispatchToProps = (dispatch) => ({
  asyncFetch: () => {
    dispatch(fetchTopicsList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncWidget(
        TopicListContainer
      )
    )
  );
