import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { fetchStoryEntities } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import messages from '../../../resources/messages';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';
import NamedEntitiesTable from './NamedEntitiesTable';

const localMessages = {
  title: { id: 'story.entities.title', defaultMessage: 'Named Entities' },
  helpTitle: { id: 'story.entities.help.title', defaultMessage: 'About Story Named Entities' },
  helpIntro: { id: 'story.entities.help.text', defaultMessage: '<p>We run all our english stories through <a target="_blank" href="https://nlp.stanford.edu/ner/">Stanford\'s natural language pipeline</a> to extract named entities. This does a reasonably good job of identifying all the <b>people, places, and organizations</b> mentioned in this story. We don\'t disambiguate them to determine unique entities, nor can you search by these entities (for now).</p>' },
  entityOrganizations: { id: 'story.entities.organizations', defaultMessage: 'Organizations' },
  entityPeople: { id: 'story.entities.people', defaultMessage: 'People' },
  entityLocations: { id: 'story.entities.locations', defaultMessage: 'Locations' },
  notProcessed: { id: 'story.entities.notProcessed', defaultMessage: 'This story has not been processed by our named entity engine.' },
};

class StoryEntitiesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.filters);
    }
  }
  render() {
    const { entities, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    let entitiesContent = null;
    if (entities) {
      entitiesContent = (
        <Row>
          <Col lg={4}>
            <h3><FormattedMessage {...localMessages.entityOrganizations} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'ORGANIZATION')} />
          </Col>
          <Col lg={4}>
            <h3><FormattedMessage {...localMessages.entityPeople} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'PERSON')} />
          </Col>
          <Col lg={4}>
            <h3><FormattedMessage {...localMessages.entityLocations} /></h3>
            <NamedEntitiesTable entities={entities.filter(e => e.type === 'LOCATION')} />
          </Col>
        </Row>
      );
    } else {
      entitiesContent = (
        <p>
          <i><FormattedMessage {...localMessages.notProcessed} /></i>
        </p>
      );
    }
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {entitiesContent}
      </DataCard>
    );
  }
}

StoryEntitiesContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  storiesId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  entities: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.story.entities.fetchStatus,
  entities: state.topics.selected.story.entities.list,
  timespanId: state.topics.selected.filters.timespanId,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: () => {
    dispatch(fetchStoryEntities(ownProps.topicId, ownProps.storiesId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData();
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpIntro)(
        composeAsyncContainer(
          StoryEntitiesContainer
        )
      )
    )
  );
