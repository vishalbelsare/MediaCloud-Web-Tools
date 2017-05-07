import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../resources/messages';
import AppSubHeader from '../common/header/AppSubHeader';
import { favoriteSource, favoriteCollection } from '../../actions/sourceActions';
import { updateFeedback } from '../../actions/appActions';
import { nullOrUndefined } from '../../lib/formValidators';

const localMessages = {
  sourceFavorited: { id: 'source.favorited', defaultMessage: 'Starred this source' },
  sourceUnfavorited: { id: 'source.unfavorited', defaultMessage: 'Un-starred this source' },
  collectionFavorited: { id: 'collection.favorited', defaultMessage: 'Starred this collection' },
  collectionUnfavorited: { id: 'collection.unfavorited', defaultMessage: 'Un-starred this collection' },
  collectionDynamic: { id: 'collection.unfavorited', defaultMessage: 'Dynamic (can change)' },
  collectionStatic: { id: 'collection.unfavorited', defaultMessage: 'Static (won\'t change)' },
};

const SourceMgrSubHeaderContainer = (props) => {
  const { currentSelection, sourceId, sourceInfo, collectionId, collectionInfo, handleSetFavorited } = props;
  const { formatMessage } = props.intl;
  let content = null;

  if (!nullOrUndefined(sourceId) || currentSelection.includes('sources')) { // for multiple pathways
    let details = '';
    details += `ID #${sourceInfo.id}`;
    details += ` • ${formatMessage(messages.public)} `; // for now, every media source is public
    details += (sourceInfo.is_monitored) ? ` • ${formatMessage(messages.monitored)}` : '';
    content = (
      <div className="source-sub-header">
        <AppSubHeader
          title={`${formatMessage(messages.sourceName)}: ${sourceInfo.name}`}
          subTitle={details}
          isFavorite={sourceInfo.isFavorite}
          onSetFavorited={isFav => handleSetFavorited('source', sourceInfo.id, isFav)}
        />
      </div>
    );
  } else if (!nullOrUndefined(collectionId) || currentSelection.includes('collections')) {
    let details = '';
    details += `ID #${collectionInfo.id}`;
    details += (collectionInfo.show_on_media === 1) ? ` • ${formatMessage(messages.public)}` : ` • ${formatMessage(messages.private)}`;
    details += (collectionInfo.is_static === 1) ? ` • ${formatMessage(localMessages.collectionStatic)}` : ` • ${formatMessage(localMessages.collectionDynamic)}`;
    content = (
      <div className="collection-sub-header">
        <AppSubHeader
          title={`${formatMessage(messages.collectionName)}: ${collectionInfo.label || collectionInfo.tag}`}
          subTitle={details}
          isFavorite={collectionInfo.isFavorite}
          onSetFavorited={isFav => handleSetFavorited('collection', collectionInfo.id, isFav)}
        />
      </div>
    );
  } else {
    content = null;
  }
  return (
    <div className="source-mgr-subheader">
      {content}
    </div>
  );
};

SourceMgrSubHeaderContainer.propTypes = {
  // from parent
  // from context
  params: React.PropTypes.object,       // params from router
  location: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  // state
  sourceId: React.PropTypes.number,
  sourceInfo: React.PropTypes.object,
  collectionId: React.PropTypes.number,
  collectionInfo: React.PropTypes.object,
  // from dispatch
  handleSetFavorited: React.PropTypes.func.isRequired,
  // from url
  currentSelection: React.PropTypes.string,
};

const mapStateToProps = state => ({
  sourceId: state.sources.sources.selected.id,
  sourceInfo: state.sources.sources.selected.sourceDetails,
  collectionId: state.sources.collections.selected.id,
  collectionInfo: state.sources.collections.selected.collectionDetails.object,
  currentSelection: state.routing.locationBeforeTransitions.pathname,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSetFavorited: (type, id, isFav) => {
    switch (type) {
      case 'source':
        dispatch(favoriteSource(id, isFav))
          .then(() => {
            const msg = (isFav) ? localMessages.sourceFavorited : localMessages.sourceUnfavorited;
            dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
          });
        break;
      case 'collection':
        dispatch(favoriteCollection(id, isFav))
          .then(() => {
            const msg = (isFav) ? localMessages.collectionFavorited : localMessages.collectionUnfavorited;
            dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
          });
        break;
      default:
        const error = { message: `unknown type to mark as favorite: ${type}` };
        throw error;
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SourceMgrSubHeaderContainer
    )
  );
