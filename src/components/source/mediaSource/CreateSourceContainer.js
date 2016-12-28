import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New Source' },
  feedback: { id: 'source.add.feedback.worked', defaultMessage: 'We saved your new source' },
  saveFailed: { id: 'source.add.feedback.failed', defaultMessage: 'Sorry, your request failed for some reason' },
};

const CreateSourceContainer = (props) => {
  const { handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <div>
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
        if (result.errors.length === 0) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          const mediaId = result.media[0].media_id;
          dispatch(fetchSourceDetails(mediaId))
            .then(() =>
              dispatch(push(`/sources/${mediaId}`))
            );
        } else {
          // let them know it didn't work
          const message = ownProps.intl.formatMessage(localMessages.saveFailed);
          dispatch(updateFeedback({ open: true, message }));
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
