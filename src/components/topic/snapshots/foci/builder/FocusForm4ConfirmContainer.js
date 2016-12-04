import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import composeIntlForm from '../../../../common/IntlForm';
import KeywordSearchSummary from './keywordSearch/KeywordSearchSummary';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';
import AppButton from '../../../../common/AppButton';
import messages from '../../../../../resources/messages';
import { createFocalSetDefinition, setTopicNeedsNewSnapshot, createFocusDefinition, goToCreateFocusStep }
  from '../../../../../actions/topicActions';
import { updateFeedback } from '../../../../../actions/appActions';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocusDescriptionForm';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your New "{name}" Focus' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Focal Technique</b>: {name}' },
  focalSetExisting: { id: 'focus.create.confirm.focalSetExisting', defaultMessage: '<b>Focal Technique</b>: Add to existing' },
  focalSetNew: { id: 'focus.create.confirm.focalSetNew', defaultMessage: '<b>Focal Technique</b>: Create a new one named {name} ({description}' },
  unimplemented: { id: 'focus.create.confirm.unimplemented', defaultMessage: 'Unimplemented' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Focus' },
  focalSetSaved: { id: 'focalSet.saved', defaultMessage: 'We saved your new Focal Set.' },
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Focus.' },
};

const FocusForm4ConfirmContainer = (props) => {
  const { topicId, formValues, initialValues, handlePreviousStep, handleSubmit, finishStep } = props;
  const { formatMessage } = props.intl;
  let content = null;
  switch (formValues.focalTechnique) {
    case FOCAL_TECHNIQUE_BOOLEAN_QUERY:
      content = <KeywordSearchSummary topicId={topicId} properties={formValues} initialValues={initialValues} />;
      break;
    default:
      content = <FormattedMessage {...localMessages.unimplemented} />;
  }
  let focalSetContent = null;
  switch (formValues.focalSetDefinitionId) {
    case NEW_FOCAL_SET_PLACEHOLDER_ID:
      focalSetContent = <FormattedHTMLMessage {...localMessages.focalSetNew} values={{ name: formValues.focalSetName, description: formValues.focalSetDescription }} />;
      break;
    default:
      focalSetContent = <FormattedHTMLMessage {...localMessages.focalSetExisting} />;
  }
  return (
    <form className="focus-confirm" name="snapshotFocusFormConfirm" onSubmit={handleSubmit(finishStep.bind(this))}>
      <Grid>
        <Row>
          <Col lg={12}>
            <h2><FormattedMessage {...localMessages.title} values={{ name: formValues.name }} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ul>
              <li><FormattedHTMLMessage {...localMessages.name} values={{ name: formValues.focusName }} /></li>
              <li><FormattedHTMLMessage {...localMessages.description} values={{ description: formValues.focusDescription }} /></li>
              <li>{focalSetContent}</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <h3><FormattedHTMLMessage {...localMessages.focalTechnique} values={{ name: formValues.focalTechnique }} /></h3>
            {content}
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <br /><br />
            <AppButton label={formatMessage(messages.previous)} onClick={handlePreviousStep} />
            &nbsp; &nbsp;
            <AppButton primary label={formatMessage(localMessages.addAnotherFocus)} type="submit" />
          </Col>
        </Row>
      </Grid>
    </form>
  );
};

FocusForm4ConfirmContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  // form context
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  formValues: React.PropTypes.object.isRequired,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  handlePreviousStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formValues: state.form.snapshotFocus.values,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreateFocusStep(2));
  },
  saveFocus: (topicId, values, focalSetSavedMessage, focusSavedMessage) => {
    const newFocusDefinition = {
      focusName: values.focusName,
      focusDescription: values.focusDescription,
      keywords: values.keywords,
    };
    if (values.focalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
      const newFocalSetDefinition = {
        focalSetName: values.focalSetName,
        focalSetDescription: values.focalSetDescription,
        focalTechnique: values.focalTechnique,
      };
      // save the focal definition
      dispatch(createFocalSetDefinition(topicId, newFocalSetDefinition))
        .then((results) => {
          // TODO: check results to make sure it worked before proceeding
          dispatch(updateFeedback({ open: true, message: focalSetSavedMessage }));  // user feedback
          // save the focus
          newFocusDefinition.focalSetDefinitionsId = results.focal_set_definitions_id;
          dispatch(createFocusDefinition(topicId, newFocusDefinition))
            .then(() => {
              dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
              dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
              dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
            });
        });
    } else {
      newFocusDefinition.focalSetDefinitionsId = values.focalSetDefinitionId;
      dispatch(createFocusDefinition(topicId, newFocusDefinition))
        .then(() => {
          // TODO: check results to make sure it worked before proceeding
          dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
          dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
          dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
        });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      dispatchProps.saveFocus(ownProps.topicId, values,
        ownProps.intl.formatMessage(localMessages.focalSetSaved),
        ownProps.intl.formatMessage(localMessages.focusSaved)
      );
    },
  });
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          FocusForm4ConfirmContainer
        )
      )
    )
  );
