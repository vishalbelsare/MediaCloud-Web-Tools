import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchAdminTopicList } from '../../../actions/topicActions';
import TopicStatusTable from './TopicStatusTable';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  stateToShow: { id: 'topics.adminList.selectState', defaultMessage: 'State To Show' },
};

class TopicStatusDashboardContainer extends React.Component {

  state = {
    selectedTopicState: 'error',
  };

  handleTopicStateSelected = (event, index, value) => this.setState({ selectedTopicState: value });

  render() {
    const { topics } = this.props;
    const { formatMessage } = this.props.intl;
    const uniqueStates = Array.from(new Set(topics.map(t => t.state)));
    const topicsToShow = topics.filter(t => t.state === this.state.selectedTopicState);
    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <SelectField
              floatingLabelText={formatMessage(localMessages.stateToShow)}
              value={this.state.selectedTopicState}
              onChange={this.handleTopicStateSelected}
            >
              {uniqueStates.map((state, index) => <MenuItem key={index} value={state} primaryText={state} />)}
            </SelectField>
          </Col>
        </Row>
        <Row>
          <TopicStatusTable topics={topicsToShow} />
        </Row>
      </Grid>
    );
  }

}

TopicStatusDashboardContainer.propTypes = {
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.adminList.fetchStatus,
  topics: state.topics.adminList.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchAdminTopicList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicStatusDashboardContainer
      )
    )
  );
