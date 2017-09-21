import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { fetchMediaPickerFeaturedCollections } from '../../../actions/systemActions';
import MediaPickerWrapper from './MediaPickerWrapper';
import * as fetchConstants from '../../../lib/fetchConstants';
import TAG_SET_MC_ID from '../../../lib/tagUtil';
import LoadingSpinner from '../LoadingSpinner';

const SelectMediaFeaturedAsyncContainer = (props) => {
  const { fetchStatus, featured, handleToggleAndSelectMedia } = props;
  let whichMedia = [];
  if (fetchStatus !== fetchConstants.FETCH_SUCCEEDED) {
    return <LoadingSpinner />;
  }
  whichMedia = featured.list;
  whichMedia.fetchStatus = featured.fetchStatus;
  whichMedia.type = 'collections';

  return <MediaPickerWrapper whichMedia={whichMedia} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
};

SelectMediaFeaturedAsyncContainer.propTypes = {
  fetchStatus: React.PropTypes.string,
  featured: React.PropTypes.object,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.featured.fetchStatus,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchMediaPickerFeaturedCollections(TAG_SET_MC_ID));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectMediaFeaturedAsyncContainer
      )
    )
  );

