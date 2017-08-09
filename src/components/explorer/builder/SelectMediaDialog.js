import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';
import MediaSelectionContainer from './selectMedia/MediaSelectionContainer';
import SelectMediaResultsContainer from './selectMedia/SelectMediaResultsContainer';
import { fetchMediaPickerFeaturedCollections } from '../../../actions/explorerActions';
import AppButton from '../../common/AppButton';
import { EditButton } from '../../common/IconButton';

const localMessages = {
  selectMediaTitle: { id: 'explorer.media.select', defaultMessage: 'Modify Sources and Collections' },
  searchByName: { id: 'explorer.media.select.searchby.name', defaultMessage: 'Search by Name/URL' },
  selectedMedia: { id: 'explorer.media.select.media', defaultMessage: 'Selected Media' },
};

class SelectMediaDialog extends React.Component {

  state = {
    open: false,
  };

  handleModifyClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { selectedMedia, queryArgs, handleSelection } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <AppButton
        label={formatMessage(messages.cancel)}
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
  queryArgs: React.PropTypes.object,
  selectedMedia: React.PropTypes.array,
  handleSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedCollections: state.explorer.selected.sources, // maybe we want these dunnoyet
  selectedSources: state.explorer.selected.collections,
  fetchStatus: state.explorer.collections.fetchStatus,
  selectedMedia: state.explorer.selected.collections,
});

const mapDispatchToProps = dispatch => ({
  handleSelection: (values) => {
    if (values) {
      dispatch(fetchMediaPickerFeaturedCollections(5));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SelectMediaDialog
    )
  );

