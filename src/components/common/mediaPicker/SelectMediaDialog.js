import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';
import MediaSelectionContainer from './MediaSelectionContainer';
import SelectMediaResultsContainer from './SelectMediaResultsContainer';
import { fetchMediaPickerFeaturedCollections, initializePreviouslySelectedMedia, clearSelectedMedia } from '../../../actions/systemActions';
import AppButton from '../AppButton';
import { EditButton } from '../IconButton';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
  selectMediaTitle: { id: 'system.mediaPicker.select', defaultMessage: 'Modify Sources and Collections' },
  searchByName: { id: 'system.mediaPicker.select.searchby.name', defaultMessage: 'Search by Name/URL' },
  selectedMedia: { id: 'system.mediaPicker.select.media', defaultMessage: 'Selected Media' },
};

class SelectMediaDialog extends React.Component {

  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    // select the media so we fill the reducer with the previously selected media
    const { selectedMedia, initMedia, handleInitialSelectionOfMedia, clearMediaSelectionForQuery } = this.props;
    if ((JSON.stringify(initMedia) !== JSON.stringify(selectedMedia)) || (JSON.stringify(initMedia) !== JSON.stringify(nextProps.initMedia))) {
      clearMediaSelectionForQuery();
      if (nextProps.initMedia) { // expects an array of media from caller
        nextProps.initMedia.map(v => handleInitialSelectionOfMedia(v));
      }
    }
  }

  handleModifyClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    const { onConfirmSelection, selectedMedia } = this.props;
    this.setState({ open: false });
    onConfirmSelection(selectedMedia); // passed in from containing element
  };

  render() {
    const { selectedMedia, handleSelection, lookupTimestamp } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = (
      <AppButton
        label={formatMessage(messages.ok)}
        onTouchTap={this.handleRemoveDialogClose}
        type="submit"
        primary
      />
    );
    let modalContent = null;
    if (this.state.open) {
      modalContent = (
        <div>
          <div
            className="select-media-dialog-modal"
            title={formatMessage(localMessages.selectMediaTitle)}
            open={this.state.open}
          >
            <div className="select-media-dialog-modal-inner">
              <Grid>
                <Row>
                  <Col lg={2}>
                    <MediaSelectionContainer selectedMedia={selectedMedia} />
                  </Col>
                  <Col lg={6}>
                    <SelectMediaResultsContainer timestamp={lookupTimestamp} selectedMediaQueryType={0} selectedMedia={selectedMedia} handleSelection={handleSelection} />
                  </Col>
                </Row>
              </Grid>
            </div>
            {dialogActions}
          </div>
          <div className="backdrop" onTouchTap={this.handleRemoveDialogClose} />
        </div>
      );
    }

    return (
      <div className="select-media-menu">
        <EditButton
          onClick={this.handleModifyClick}
          tooltip={formatMessage(messages.ok)}
        />
        {modalContent}
      </div>
    );
  }

}

SelectMediaDialog.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent/implementer
  initMedia: React.PropTypes.array,
  selectedMedia: React.PropTypes.array,
  lookupTimestamp: React.PropTypes.string,
  handleSelection: React.PropTypes.func.isRequired,
  handleInitialSelectionOfMedia: React.PropTypes.func.isRequired,
  clearMediaSelectionForQuery: React.PropTypes.func.isRequired,
  onConfirmSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.selectMedia.fetchStatus,
  selectedMedia: state.system.mediaPicker.selectMedia.list, // initially empty
  lookupTimestamp: state.system.mediaPicker.featured.timestamp, // or maybe any of them? trying to get to receive new props when fetch succeeds
});

const mapDispatchToProps = dispatch => ({
  handleSelection: (values) => {
    if (values) {
      dispatch(fetchMediaPickerFeaturedCollections(5));
    }
  },
  clearMediaSelectionForQuery: () => {
    dispatch(clearSelectedMedia());
  },
  handleInitialSelectionOfMedia: (prevSelectedMedia) => {
    if (prevSelectedMedia) {
      dispatch(initializePreviouslySelectedMedia(prevSelectedMedia)); // disable MediaPickerPreviewList button too
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SelectMediaDialog
    )
  );

