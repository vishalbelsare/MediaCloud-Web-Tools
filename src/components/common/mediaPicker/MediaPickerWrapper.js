import PropTypes from 'prop-types';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import * as fetchConstants from '../../../lib/fetchConstants';
import MediaPickerPreviewList from '../MediaPickerPreviewList';

class MediaPickerWrapper extends React.Component {

  render() {
    const { title, whichMedia, handleToggleAndSelectMedia } = this.props;
    let content = null;
    if (whichMedia.storedKeyword !== null && whichMedia.storedKeyword !== undefined &&
      whichMedia.storedKeyword.mediaKeyword &&
      (whichMedia.fetchStatus === null || whichMedia.fetchStatus === fetchConstants.FETCH_ONGOING)) {
      content = <LoadingSpinner />;
    } else if (whichMedia && whichMedia.length > 0) {
      content = (
        <div>
          <h2>{title}</h2>
          <MediaPickerPreviewList
            items={whichMedia}
            classStyle="browse-items"
            itemType="media"
            linkInfo={c => `${whichMedia.type}/${c.tags_id || c.media_id}`}
            linkDisplay={c => `${c.name}`}
            onSelectMedia={c => handleToggleAndSelectMedia(c)}
          />
        </div>
      );
    }
    return content;
  }

}

MediaPickerWrapper.propTypes = {
  // from parent
  title: PropTypes.string,
  whichMedia: PropTypes.array,
  handleToggleAndSelectMedia: PropTypes.func,
};

export default MediaPickerWrapper;
