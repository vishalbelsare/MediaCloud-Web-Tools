import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { SelectField, MenuItem } from 'material-ui';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicsList, setTopicListFilter, setTopicFavorite } from '../../../actions/topicActions';
import { pagedLocation } from '../../util/location';
import composePagedContainer from '../../common/PagedContainer';
import TopicPreviewList from './TopicPreviewList';
import { updateFeedback } from '../../../actions/appActions';
import messages from '../../../resources/messages';
import { TOPIC_PUBLIC, TOPIC_PERSONAL, TOPIC_STARRED } from '../../../lib/topicFilterUtil';

const PAGED_LENGTH = 19;

const localMessages = {
  topicsListFilter: { id: 'topics.list.filter', defaultMessage: 'Filter Topics By: ' },
  topicsListPublic: { id: 'topics.list.public', defaultMessage: 'Public Topics' },
  topicsListFavorites: { id: 'topics.list.favorite', defaultMessage: 'Starred Topics' },
  topicsListPersonal: { id: 'topics.list.personal', defaultMessage: 'Personal Topics' },
  noAccess: { id: 'topics.list.noAccess', defaultMessage: "Sorry, you don't have the permissions to view this list." },
};

class TopicListContainer extends React.Component {

  componentWillMount() {
    const { topics, currentFilter } = this.props;
    // if user hasn't set filter, set it smartly
    if (currentFilter === null) {
      if (topics.favorite.length > 0) {
        this.handleSetFilter(TOPIC_STARRED);
      } else if (topics.personal.length > 0) {
        this.handleSetFilter(TOPIC_PERSONAL);
      } else {
        this.handleSetFilter(TOPIC_PUBLIC);
      }
    }
  }

  handleSetFilter = (filterType) => {
    const { setFilter } = this.props;
    setFilter(filterType);
  }

  render() {
    const { topics, dispatchToTopicPage, currentFilter, nextButton, previousButton, handleSetFavorited } = this.props;
    const { formatMessage } = this.props.intl;
    let whichTopics = topics.public;
    let titleContent = null;
    let showPrevNextButtons = (
      <Col lg={12} md={12} sm={12}>
        {previousButton}
        {nextButton}
      </Col>
    );

    // if the user has favorites => is logged_in => isn't logged in, show topics by filter
    if (currentFilter === TOPIC_STARRED && topics !== undefined) {
      titleContent = <h2><FormattedMessage {...localMessages.topicsListFavorites} /></h2>;
      whichTopics = topics.favorite;
    } else if (currentFilter === TOPIC_PERSONAL && topics !== undefined) {
      titleContent = <h2><FormattedMessage {...localMessages.topicsListPersonal} /></h2>;
      whichTopics = topics.personal;
    } else if (currentFilter === TOPIC_PUBLIC && topics !== undefined) {
      titleContent = <h2><FormattedMessage {...localMessages.topicsListPublic} /></h2>;
      whichTopics = topics.public;
    } else { // when user is not logged in and clicks the other options
      titleContent = <h2><FormattedMessage {...localMessages.noAccess} /></h2>;
    }

    if (whichTopics.length < PAGED_LENGTH) {
      showPrevNextButtons = null;
    }

    return (
      <div className="topic-list-container">

        <Row>
          <Col lg={2} md={2} sm={12}>
            { titleContent }
          </Col>
          <Col lg={2} md={2} sm={12}>
            <span className="label unlabeled-field-label">
              <FormattedMessage {...localMessages.topicsListFilter} />
            </span>
          </Col>
          <Col lg={7} md={7} sm={12}>
            <SelectField name="currentFilter" style={{ fontSize: 13 }} value={currentFilter}>
              <MenuItem
                value={TOPIC_STARRED}
                onClick={() => this.handleSetFilter('favorites')}
                primaryText={formatMessage(localMessages.topicsListFavorites)}
                style={{ fontSize: 13 }}
              />
              <MenuItem
                value={TOPIC_PERSONAL}
                primaryText={formatMessage(localMessages.topicsListPersonal)}
                onClick={() => this.handleSetFilter('personal')}
                style={{ fontSize: 13 }}
              />
              <MenuItem
                value={TOPIC_PUBLIC}
                onClick={() => this.handleSetFilter('public')}
                primaryText={formatMessage(localMessages.topicsListPublic)}
                style={{ fontSize: 13 }}
              />
            </SelectField>
          </Col>
        </Row>

        <TopicPreviewList
          topics={whichTopics}
          currentFilter={currentFilter}
          linkGenerator={t => dispatchToTopicPage(`topics/${t.topics_id}/summary`)}
          errorTopicHandler={t => dispatchToTopicPage(`topics/${t.topics_id}/editUpdate`)}
          onSetFavorited={handleSetFavorited}
        />

        <Row>
          { showPrevNextButtons }
        </Row>

      </div>
    );
  }
}

TopicListContainer.propTypes = {
  // from state
  topics: PropTypes.object.isRequired,
  links: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  handleSetFavorited: PropTypes.func.isRequired,
  dispatchToTopicPage: PropTypes.func.isRequired,
  // from PagedContainer wrapper
  nextButton: PropTypes.node,
  previousButton: PropTypes.node,
  params: PropTypes.object.isRequired,       // params from router
  location: PropTypes.object.isRequired,
  showFavorites: PropTypes.bool,
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.all.fetchStatus,
  topics: state.topics.all.topics,
  links: state.topics.all.link_ids,
  currentFilter: state.topics.all.currentFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchToTopicPage: (page) => {
    dispatch(push(page));
  },
  asyncFetch: () => {
    dispatch(fetchTopicsList());
  },
  setFilter: (filter) => {
    dispatch(setTopicListFilter({ currentFilter: filter }));
  },
  fetchPagedData: (props, linkId) => {
    dispatch(fetchTopicsList(linkId))
      .then(() => {
        dispatch(push(pagedLocation(ownProps.location, linkId)));
      });
  },
  handleSetFavorited: (topicId, isFavorite) => {
    dispatch(setTopicFavorite(topicId, isFavorite))
      .then(() => {
        const msg = (isFavorite) ? messages.topicFavorited : messages.topicUnfavorited;
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
        dispatch(fetchTopicsList());  // need to update the list
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    nextPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.next);
    },
    previousPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.previous);
    },
  });
}

export default
  injectIntl(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        composePagedContainer(
          composeAsyncContainer(
            TopicListContainer
          )
        )
      )
    )
  );
