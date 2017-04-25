import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { createFeed, updateFeedback, fetchSourceFeed } from '../../../actions/sourceActions';
import SourceFeedForm from './form/SourceFeedForm';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: Feeds' },
  add: { id: 'source.deatils.feeds.add', defaultMessage: 'Add A Feed' },
  createButton: { id: 'source.deatils.feeds.update.button', defaultMessage: 'Create' },
};

const CreateSourceFeedContainer = (props) => {
  const { sourceId, handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${parentTitle}`;
  const content = null;
  if (sourceId === undefined) {
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
        onSave={handleSave}
        buttonLabel={formatMessage(localMessages.createButton)}
      />
    </Grid>
  );
};

CreateSourceFeedContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sourceId: React.PropTypes.number.isRequired,
  feed: React.PropTypes.object,
  feedId: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.sources.sources.selected.feed.feeds.fetchStatus,
  feed: state.sources.sources.selected.feed.info.feed,
  feedId: state.sources.sources.selected.feed.info.feedId,
  sourceId: parseInt(ownProps.params.sourceId, 10),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      url: values.url,
      feed_status: values.feed_status,
      feed_type: values.feed_type,
    };
    dispatch(createFeed(ownProps.params.mediaId, infoToSave))
      .then((result) => {
        if (result.success === 1) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSourceFeed(ownProps.params.feedId))
            .then(() =>
              dispatch(push(`/sources/${ownProps.params.feedId}/edit`))
            );
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateSourceFeedContainer
    )
  );
