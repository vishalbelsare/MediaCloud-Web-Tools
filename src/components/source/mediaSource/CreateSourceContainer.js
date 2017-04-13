import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { CREATE_SOURCE_STATUS_ERROR, CREATE_SOURCE_STATUS_NEW, CREATE_SOURCE_STATUS_EXISTING } from '../../../lib/serverApi/sources';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New Source' },
  savedNew: { id: 'source.add.feedback.new', defaultMessage: 'We saved your new source' },
  updatedExisting: { id: 'source.add.feedback.existing', defaultMessage: 'We updated this existing source' },
  saveFailed: { id: 'source.add.feedback.error', defaultMessage: 'Sorry, your request failed for some reason' },
};

const CreateSourceContainer = (props) => {
  const { handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <div className="create-source">
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <SourceForm
            buttonLabel={formatMessage(localMessages.addButton)}
            onSave={handleSave}
          />
        </Grid>
      </Permissioned>
    </div>
  );
};

CreateSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const metadataTagFormKeys = ['publicationCountry'];
    const infoToSave = {
      url: values.url,
      name: values.name,
      notes: values.notes,
      editor_notes: values.editor_notes,
      public_notes: values.public_notes,
      montitored: values.monitored,
    };
    metadataTagFormKeys.forEach((key) => { // the metdata tags are encoded in individual properties on the form
      if (key in values) {
        infoToSave[key] = values[key];
      }
    });
    if ('collections' in values) {  // the collections are a FieldArray on the form
      infoToSave['collections[]'] = values.collections.map(s => s.id);
    } else {
      infoToSave['collections[]'] = [];
    }
    // save it
    dispatch(createSource(infoToSave))
      .then((result) => {
        let resultMediaId = null;
        switch (result.status) {
          case CREATE_SOURCE_STATUS_NEW:
            dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.savedNew) }));
            // need to fetch it again because something may have changed
            resultMediaId = result.media_id;
            dispatch(fetchSourceDetails(resultMediaId))
              .then(() =>
                dispatch(push(`/sources/${resultMediaId}`)));
            break;
          case CREATE_SOURCE_STATUS_EXISTING:
            dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.updatedExisting) }));
            resultMediaId = result.media_id;
            dispatch(push(`/sources/${resultMediaId}`));
            break;
          case CREATE_SOURCE_STATUS_ERROR:
          default:
            // let them know it didn't work
            const message = ownProps.intl.formatMessage(localMessages.saveFailed);
            dispatch(updateFeedback({ open: true, message }));
            break;
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateSourceContainer
    ),
  );
