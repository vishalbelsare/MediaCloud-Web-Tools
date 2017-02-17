import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { uploadSourceListFromTemplate } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import LoadingSpinner from '../../common/LoadingSpinner';
import CollectionUploadConfirmer from './form/CollectionUploadConfirmer';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';

const localMessages = {
  downloadEmpty: { id: 'collections.download.emptycsv', defaultMessage: 'Download a template in CSV format' },
  downloadFull: { id: 'collections.download.fullcsv', defaultMessage: 'Download current sources in CSV format' },
  helpText: { id: 'collection.upload.help.text',
    defaultMessage: 'You can modify or add sources in batch using a CSV file.  First download the CSV template by clicking the Download button.  Then edit it, and upload it.',
  },
  feedback: { id: 'collection.upload.feedback', defaultMessage: 'This upload was successful' },
};
class CollectionUploadSourceContainer extends React.Component {

  downloadCsv = (evt) => {
    const { myCollectionId } = this.props;
    if (evt) {
      evt.preventDefault();
    }
    let url = null;
    if (myCollectionId) {
      url = `/api/collections/${myCollectionId}/sources.csv?dType=1`;
    } else {
      url = '/api/template/sources.csv?dType=1';
    }
    window.location = url;
  }
  selectedCSV = () => {
    this.setState({ confirmTemplate: true });
  }

  confirmLoadCSV = () => {
    this.setState({ confirmTemplate: false });
  }

  uploadCSV = () => {
    const { uploadCSVFile } = this.props;
    const fd = this.textInput.files[0];
    uploadCSVFile(fd);
    this.selectedCSV();
  }
  render() {
    const { onConfirm, mysources, myCollectionId } = this.props;
    const { formatMessage } = this.props.intl;
    let confirmContent = null;
    if (mysources && mysources.length > 0 && this.state && this.state.confirmTemplate) {
      confirmContent = (
        <CollectionUploadConfirmer onConfirm={onConfirm} onCancel={this.confirmLoadCSV} onClickButton={this.confirmLoadCSV} />
      );
    } else if (this.state && this.state.confirmTemplate) {
      confirmContent = <LoadingSpinner />;
    }
    let downloadLabel;
    if (mysources && mysources.length > 0 && myCollectionId != null) {
      downloadLabel = formatMessage(localMessages.downloadFull);
    } else {
      downloadLabel = formatMessage(localMessages.downloadEmpty);
    }
    return (
      <div>
        <p>
          <FormattedMessage {...localMessages.helpText} />
        </p>
        <a href="#download" onClick={this.downloadCsv} >
          {downloadLabel}
        </a>
        &nbsp;
        <DownloadButton tooltip={downloadLabel} onClick={this.downloadCsv} />
        <br />
        <br />
        <b><FormattedMessage {...messages.upload} />:</b> &nbsp;
        <input type="file" onChange={this.uploadCSV} ref={(input) => { this.textInput = input; }} disabled={this.state && this.state.confirmTemplate} />
        { confirmContent }
      </div>
    );
  }
}

CollectionUploadSourceContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  // from parent
  onConfirm: React.PropTypes.func.isRequired,
  mysources: React.PropTypes.array,
  myCollectionId: React.PropTypes.string,
  // from parent
  // from composition
  intl: React.PropTypes.object.isRequired,
  uploadCSVFile: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toUpload.fetchStatus,
  mysources: state.sources.collections.form.toUpload.list, // this will activate confirmation message and button
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadCSVFile: (csvFile) => {
    dispatch(uploadSourceListFromTemplate({ file: csvFile }))
      .then((results) => {
        if (results.status === 'Error') {
          updateFeedback({ open: true, message: ownProps.intl.formatMessage({ id: 'collection.upload.error', defaultMessage: results.message }) });
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CollectionUploadSourceContainer
    )
  );
