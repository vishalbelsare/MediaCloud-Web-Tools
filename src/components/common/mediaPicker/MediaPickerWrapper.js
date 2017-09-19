import PropTypes from 'prop-types';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import * as fetchConstants from '../../../lib/fetchConstants';
import MediaPickerPreviewList from '../MediaPickerPreviewList';

/**
 * Simple wrapper so we can style all the button the same.  Use this instead of
 * material-ui's RaisedButton.
 * @see http://stackoverflow.com/questions/39458150/is-it-possible-to-add-a-custom-hover-color-to-raised-buttons
 */
class MediaPickerWrapper extends React.Component {

  render() {
    const { whichMedia, handleToggleAndSelectMedia } = this.props;
    let content = null;
    if (whichMedia.storedKeyword !== null && whichMedia.storedKeyword !== undefined &&
      whichMedia.storedKeyword.mediaKeyword &&
      (whichMedia.fetchStatus === null || whichMedia.fetchStatus === fetchConstants.FETCH_ONGOING)) {
      content = <LoadingSpinner />;
    } else if (whichMedia && whichMedia.length > 0) {
      content = (
        <MediaPickerPreviewList
          items={whichMedia}
          classStyle="browse-items"
          itemType="media"
          linkInfo={c => `${whichMedia.type}/${c.tags_id || c.media_id}`}
          linkDisplay={c => (c.label ? c.label : c.name)}
          onSelectMedia={c => handleToggleAndSelectMedia(c)}
        />
      );
    }
    return content;
  }

}

MediaPickerWrapper.propTypes = {
  // from parent
  whichMedia: PropTypes.array,
  handleToggleAndSelectMedia: PropTypes.func,
};

export default MediaPickerWrapper;
