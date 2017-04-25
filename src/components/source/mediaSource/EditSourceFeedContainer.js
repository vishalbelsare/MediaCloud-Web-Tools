import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import composeAsyncContainer from '../../common/AsyncContainer';
import { selectSourceFeed, updateFeed, updateFeedback, fetchSourceFeed } from '../../../actions/sourceActions';
import SourceFeedForm from './form/SourceFeedForm';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
  add: { id: 'source.deatils.feeds.add', defaultMessage: 'Update A Feed' },
  updateButton: { id: 'source.deatils.feeds.update.button', defaultMessage: 'Update' },
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
  sourceId: React.PropTypes.number,
  feed: React.PropTypes.object,
  feedId: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.sources.sources.selected.feed.info.fetchStatus,
  feed: state.sources.sources.selected.feed.info.feed,
  sourceId: parseInt(ownProps.params.sourceId, 10),
  feedId: parseInt(ownProps.params.feedId, 10),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      url: values.url,
      feed_status: values.feed_status,
      feed_type: values.feed_type,
    };
    dispatch(updateFeed(ownProps.params.feedId, infoToSave))
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
    dispatch(selectSourceFeed(feedId));
    dispatch(fetchSourceFeed(feedId));
  },
  asyncFetch: () => {
    dispatch(selectSourceFeed(ownProps.params.feedId));
    dispatch(fetchSourceFeed(ownProps.params.sourceId, ownProps.params.feedId));
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
