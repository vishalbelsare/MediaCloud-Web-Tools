import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';
import MediaSelectionContainer from './MediaSelectionContainer';
import SelectMediaResultsContainer from './SelectMediaResultsContainer';
import { fetchMediaPickerFeaturedCollections, selectMedia, clearSelectedMedia } from '../../../actions/systemActions';
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
    const { selected, handleInitialSelectionOfMedia, clearMediaSelectionForQuery } = this.props;
    if (selected.index !== nextProps.selected.index) {
      clearMediaSelectionForQuery();
      nextProps.savedCollections.map(v => handleInitialSelectionOfMedia(v));
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
    const { selectedMedia, queryArgs, handleSelection } = this.props;
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
                    <SelectMediaResultsContainer selectedMediaQueryType={0} queryArgs={queryArgs} selectedMedia={selectedMedia} handleSelection={handleSelection} />
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
      <div className="select-media-dialog">
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
  // from parent
  selected: React.PropTypes.object,
  savedCollections: React.PropTypes.array,
  queryArgs: React.PropTypes.object,
  selectedMedia: React.PropTypes.array,
  handleSelection: React.PropTypes.func.isRequired,
  handleInitialSelectionOfMedia: React.PropTypes.func.isRequired,
  clearMediaSelectionForQuery: React.PropTypes.func.isRequired,
  onConfirmSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  savedCollections: state.explorer.selected.collections, // maybe we want these dunnoyet
  selected: state.explorer.selected,
  savedSources: state.explorer.selected.sources,
  fetchStatus: state.system.mediaPicker.selectMedia.fetchStatus,
  selectedMedia: state.system.mediaPicker.selectMedia.list, // initially empty
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
      dispatch(selectMedia(prevSelectedMedia)); // disable MediaPickerPreviewList button too
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SelectMediaDialog
    )
  );

