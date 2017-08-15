import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';
import MediaSelectionContainer from './MediaSelectionContainer';
import SelectMediaResultsContainer from './SelectMediaResultsContainer';
import { fetchMediaPickerFeaturedCollections, selectMedia } from '../../../actions/systemActions';
import AppButton from '../AppButton';
import { EditButton } from '../IconButton';
import composeHelpfulContainer from '../../common/HelpfulContainer';

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
  componentWillMount() {
    // select the media so we fill the reducer with the previously selected media
    const { savedCollections, handleInitialSelectionOfMedia } = this.props;
    if (savedCollections && savedCollections.length > 0) {
      savedCollections.map(v => handleInitialSelectionOfMedia(v));
    }
  }
  componentWillReceiveProps(nextProps) {
    // select the media so we fill the reducer with the previously selected media
    const { selected, savedCollections, handleInitialSelectionOfMedia } = this.props;
    if (selected.index !== nextProps.selected.index) {
      savedCollections.map(v => handleInitialSelectionOfMedia(v));
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
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.ok)}
        onTouchTap={this.handleRemoveDialogClose}
      />,
    ];

    return (
      <div className="explorer-select-media-dialog">
        <EditButton
          onClick={this.handleModifyClick}
          tooltip={formatMessage(messages.ok)}
        />
        <Dialog
          title={formatMessage(localMessages.selectMediaTitle)}
          actions={dialogActions}
          open={this.state.open}
          onRequestClose={this.handleRemoveDialogClose}
          className={'select-media-dialog'}
          bodyClassName={'select-media-dialog-body'}
          contentClassName={'select-media-dialog-content'}
          overlayClassName={'select-media-dialog-overlay'}
          titleClassName={'select-media-dialog-title'}
          autoDetectWindowHeight
        >
          <div className="select-media-dialog-inner">
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
        </Dialog>
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
  handleInitialSelectionOfMedia: (prevSelectedMedia) => {
    if (prevSelectedMedia) {
      dispatch(selectMedia(prevSelectedMedia)); // disable MediaPickerPreviewList button too
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.mediaPickerHelpText])(
        SelectMediaDialog
      )
    )
  );

