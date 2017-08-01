import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchMedia, selectMedia } from '../../../../actions/explorerActions';
import ContentPreview from '../../../common/ContentPreview';
import CollectionIcon from '../../../common/icons/CollectionIcon';

const SelectMediaResultsContainer = (props) => {
  const { media } = props; // TODO differentiate betwee coll and src
  let content = null;
  if (media && media.length > 0) {
    content = (
      <ContentPreview
        items={media}
        classStyle="browse-items"
        itemType="media"
        icon={<CollectionIcon height={25} />}
        linkInfo={c => `media/${c.tags_id}`}
        linkDisplay={c => c.label}
      />
    );
  }
  return (
    <div className="select-media-container">
      <div>{content}</div>
    </div>
  );
};

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  queryArgs: React.PropTypes.object,
  handleSelection: React.PropTypes.func,
  media: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.media.fetchStatus,
  media: state.explorer.media.collections,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSelection: (values) => {
    if (values) {
      dispatch(selectMedia(values, ownProps));
    }
  },
  asyncFetch: () => {
    dispatch(fetchMedia(5)); // TODO make this a real search
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectMediaResultsContainer
      )
    )
  );

