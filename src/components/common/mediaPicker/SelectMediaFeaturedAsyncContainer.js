import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../AsyncContainer';
import { fetchMediaPickerFeaturedCollections } from '../../../actions/systemActions';
import MediaPickerWrapper from './MediaPickerWrapper';
import * as fetchConstants from '../../../lib/fetchConstants';
import TAG_SET_MC_ID from '../../../lib/tagUtil';
import LoadingSpinner from '../LoadingSpinner';

const localMessages = {
  title: { id: 'system.mediaPicker.select.featured.title', defaultMessage: 'Featured Collections' },
};
const SelectMediaFeaturedAsyncContainer = (props) => {
  const { fetchStatus, featured, handleToggleAndSelectMedia } = props;
  const { formatMessage } = props.intl;
  let whichMedia = [];
  if (fetchStatus !== fetchConstants.FETCH_SUCCEEDED) {
    return <LoadingSpinner />;
  }
  whichMedia = [];
  whichMedia = featured;
  whichMedia.fetchStatus = featured.fetchStatus;
  whichMedia.type = 'collections';

  return <MediaPickerWrapper title={formatMessage(localMessages.title)} whichMedia={whichMedia} handleToggleAndSelectMedia={handleToggleAndSelectMedia} />;
};

SelectMediaFeaturedAsyncContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  featured: React.PropTypes.array,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.featured.fetchStatus,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured.list : null,
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

