import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import { updateSource, select, fetchSourceDetails } from '../../../../actions/sourceActions';
import AppButton from '../../../common/AppButton';
import SourceDetailsForm from './SourceDetailsForm';
import { updateFeedback } from '../../../../actions/appActions';
import SourceMetadataForm from './SourceMetadataForm';
import SourceCollectionsForm from './SourceCollectionsForm';
import { emptyString } from '../../../../lib/formValidators';
import composeAsyncContainer from '../../../common/AsyncContainer';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Edit Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Update Source' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We updated this source' },
};

const EditSourceContainer = (props) => {
  const { pristine, submitting, handleSubmit, handleSave, source } = props;
  const { formatMessage } = props.intl;
  const titleHandler = formatMessage(localMessages.mainTitle);
  const buttonLabel = formatMessage(localMessages.addButton);
  const intialValues = {
    ...source,
    collections: source.media_source_tags
      .map(t => ({ ...t, name: t.label }))
      .filter(t => (t.tag_sets_id === 5) && (t.show_on_media === 1)),
  };
  return (
    <div>
      <Title render={titleHandler} />
      <form className="source-details-form" name="sourcesSourceDetailsForm" onSubmit={handleSubmit(handleSave.bind(this))}>
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <SourceDetailsForm initialValues={intialValues} />
          <SourceMetadataForm />
          <SourceCollectionsForm initialValues={intialValues} />
          <Row>
            <Col lg={12}>
              <AppButton
                style={{ marginTop: 30 }}
                type="submit"
                label={buttonLabel}
                disabled={pristine || submitting}
                primary
              />
            </Col>
          </Row>
        </Grid>
      </form>
    </div>
  );
};

EditSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  collections: React.PropTypes.array,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  // from form helper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  // form state
  sourceId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sourceDetails.fetchStatus,
  source: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    // try to save it
    dispatch(updateSource(values))
      .then(() => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/sources/${ownProps.sourceId}`));
      });
  },
  asyncFetch: () => {
    dispatch(select(ownProps.params.sourceId));
    dispatch(fetchSourceDetails(ownProps.params.sourceId));
  },
});

function validate(values) {
  const errors = {};
  if (emptyString(values.name)) {
    errors.email = localMessages.nameError;
  }
  if (emptyString(values.url)) {
    errors.permission = localMessages.urlError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'sourceCreateForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          composeAsyncContainer(
            EditSourceContainer
          ),
        ),
      ),
    ),
  );
