import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import TopicList from './TopicList';
import { fetchTopicsList } from '../../actions/topicActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

const localMessages = {
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'Recent Topics' },
};

class TopicListContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { topics, fetchStatus, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(localMessages.topicsListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <TopicList topics={topics} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h2>{title}</h2>
              {content}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

TopicListContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  topics: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

TopicListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.all.fetchStatus,
  topics: state.topics.all.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => {
    dispatch(fetchTopicsList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicListContainer));
