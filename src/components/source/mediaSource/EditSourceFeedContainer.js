import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import composeAsyncContainer from '../../common/AsyncContainer';
import { selectFeed, updateFeed, updateFeedback, fetchSourceFeed } from '../../../actions/sourceActions';
import SourceFeedForm from './form/SourceFeedForm';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
  add: { id: 'source.deatils.feeds.add', defaultMessage: 'Add A Feed' },
};

class EditSourceFeedContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { feedId, fetchData } = this.props;
    if ((nextProps.feedId !== feedId)) {
      fetchData(nextProps.feedId);
    }
  }

  downloadCsv = () => {
    const { feedId, sourceId } = this.props;
    const url = `/api/sources/${sourceId}/feeds/${feedId}feeds.csv`;
    window.location = url;
  }

  render() {
    const { feed, handleSave } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${feed.name} | ${parentTitle}`;
    const content = null;
    const intialValues = {
      ...feed,
    };
    if (feed === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }
    return (
      <Grid className="details source-feed-details">
        <Title render={titleHandler} />
        <SourceFeedForm
          initialValues={intialValues}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.updateButton)}
        />
      </Grid>
    );
  }

}

EditSourceFeedContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  handleSave: React.PropTypes.func.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sourceId: React.PropTypes.string,
  feed: React.PropTypes.object,
  feedId: React.PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.feed.fetchStatus,
  feed: state.sources.sources.selected.feed,
  feedId: state.sources.sources.selected.feed.feedId,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    // try to save it
    dispatch(updateFeed(values))
      .then((result) => {
        if (result.success === 1) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSourceFeed(ownProps.params.feedId))
            .then(() =>
              dispatch(push(`/sources/${ownProps.params.feedId}`))
            );
        }
      });
  },
  fetchData: (feedId) => {
    dispatch(selectFeed(feedId));
    dispatch(fetchSourceFeed(feedId));
  },
  asyncFetch: () => {
    dispatch(selectFeed(ownProps.params.feed_id));
    dispatch(fetchSourceFeed(ownProps.params.feed_id));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        EditSourceFeedContainer
      )
    )
  );
