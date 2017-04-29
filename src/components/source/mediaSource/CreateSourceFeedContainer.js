import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import { createFeed, fetchSourceFeed } from '../../../actions/sourceActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import { LEVEL_ERROR } from '../../common/Notice';
import SourceFeedForm from './form/SourceFeedForm';

const localMessages = {
  sourceFeedsTitle: { id: 'source.details.feeds.title', defaultMessage: '{name}: ' },
  createFeedsTitle: { id: 'source.details.feeds.title.create', defaultMessage: 'Add A Feed' },
  createButton: { id: 'source.deatils.feeds.update.button', defaultMessage: 'Create' },
  feedback: { id: 'source.deatils.feeds.feedback', defaultMessage: 'Successfully created this feed.' },
  duplicateKey: { id: 'source.deatils.feeds.feedback.error.duplicate', defaultMessage: 'Duplicate key error' },
  notValidRss: { id: 'source.deatils.feeds.feedback.error.notValidRss', defaultMessage: 'Not Valid Rss error' },
  didNotWork: { id: 'source.deatils.feeds.feedback.error.didNotWork', defaultMessage: 'Did not work' },

};

const CreateSourceFeedContainer = (props) => {
  const { sourceId, handleSave, sourceName } = props;
  const { formatMessage } = props.intl;
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
      <h2>
        <MediaSourceIcon height={32} />
        <Link to={`/sources/${sourceId}/feeds`} >
          <FormattedMessage {...localMessages.sourceFeedsTitle} values={{ name: sourceName }} />
        </Link>
        <FormattedMessage {...localMessages.createFeedsTitle} />
      </h2>
      <SourceFeedForm
        onSave={handleSave}
        sourceName={sourceName}
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
  sourceName: React.PropTypes.string.isRequired,
  feed: React.PropTypes.object,
  feedId: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.sources.sources.selected.feed.feeds.fetchStatus,
  feed: state.sources.sources.selected.feed.info.feed,
  feedId: state.sources.sources.selected.feed.info.feedId,
  sourceId: parseInt(ownProps.params.sourceId, 10),
  sourceName: state.sources.sources.selected.sourceDetails.name,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      url: values.url,
      feed_status: values.feed_status,
      feed_type: values.feed_type,
    };
    dispatch(createFeed(ownProps.params.sourceId, infoToSave))
      .then((result) => {
        if (result.feed !== undefined) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSourceFeed(result.feed.media_id, result.feed.feeds_id))
            .then(() =>
              dispatch(push(`/sources/${result.feed.media_id}/feeds/${result.feed.feeds_id}/edit`))
            );
        } else if (result.message && result.message.includes('duplicate key')) {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.duplicateKey) }));
          throw new SubmissionError({ username: 'Duplicate Key error', _error: ownProps.intl.formatMessage(localMessages.duplicateKey) });
        } else if (result.message && result.message.includes('invalid')) {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.notValidRss) }));
          throw new SubmissionError({ username: 'Invalid error', _error: ownProps.intl.formatMessage(localMessages.notValidRss) });
        } else {
          dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.didNotWork) }));
          throw new SubmissionError({ username: 'Duplicate Key error', _error: ownProps.intl.formatMessage(localMessages.didNotWork) });
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
