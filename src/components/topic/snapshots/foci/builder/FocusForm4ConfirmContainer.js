import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
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
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your New "{name}" Subtopic' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Technique</b>: {name}' },
  focalSetExisting: { id: 'focus.create.confirm.focalSetExisting', defaultMessage: '<b>Technique</b>: Add to existing' },
  focalSetNew: { id: 'focus.create.confirm.focalSetNew', defaultMessage: '<b>Technique</b>: Create a new one named {name} ({description}' },
  unimplemented: { id: 'focus.create.confirm.unimplemented', defaultMessage: 'Unimplemented' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Subtopic' },
  focalSetSaved: { id: 'focalSet.saved', defaultMessage: 'We saved your new Set.' },
  focalSetNotSaved: { id: 'focus.notSaved', defaultMessage: 'Sorry, we couldn\'t save your new Set' },
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Subtopic.' },
  focusNotSaved: { id: 'focus.create.notSaved', defaultMessage: 'That didn\'t work! Make sure you have a unique Subtopic name?' },
};

const FocusForm4ConfirmContainer = (props) => {
  const { topicId, formValues, initialValues, handlePreviousStep, handleSubmit, finishStep, submitting } = props;
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
            <AppButton flat label={formatMessage(messages.previous)} onClick={handlePreviousStep} />
            &nbsp; &nbsp;
            <AppButton
              disabled={submitting}
              primary
              label={formatMessage(localMessages.addAnotherFocus)}
              type="submit"
            />
          </Col>
        </Row>
      </Grid>
    </form>
  );
};

FocusForm4ConfirmContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  // form context
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  // from state
  formValues: PropTypes.object.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formValues: state.form.snapshotFocus.values,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreateFocusStep(2));
  },
  saveFocus: (topicId, values) => {
    const focalSetSavedMessage = ownProps.intl.formatMessage(localMessages.focalSetSaved);
    const focusSavedMessage = ownProps.intl.formatMessage(localMessages.focusSaved);
    const focusNotSaved = ownProps.intl.formatMessage(localMessages.focusNotSaved);
    const focalSetNotSaved = ownProps.intl.formatMessage(localMessages.focalSetNotSaved);
    const newFocusDefinition = {
      focusName: values.focusName,
      focusDescription: values.focusDescription,
      keywords: values.keywords,
    };
    if (values.focalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
      // if they are creating a new set we need to save that first
      const newFocalSetDefinition = {
        focalSetName: values.focalSetName,
        focalSetDescription: values.focalSetDescription,
        focalTechnique: values.focalTechnique,
      };
      // save the focal definition
      dispatch(createFocalSetDefinition(topicId, newFocalSetDefinition))
        .then((results) => {
          if ((results.status) && results.status === 500) {
            dispatch(updateFeedback({ open: true, message: focalSetNotSaved }));  // user feedback that it failed
          } else {
            // TODO: check results to make sure it worked before proceeding
            dispatch(updateFeedback({ open: true, message: focalSetSavedMessage }));  // user feedback
            // save the focus
            newFocusDefinition.focalSetDefinitionsId = results.focal_set_definitions_id;
            dispatch(createFocusDefinition(topicId, newFocusDefinition))
              .then((moreResults) => {
                if ((moreResults.status) && moreResults.status === 500) {
                  dispatch(updateFeedback({ open: true, message: focusNotSaved }));  // user feedback that it failed
                } else {
                  dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
                  dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
                  dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
                  dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
                }
              });
          }
        });
    } else {
      // uses and existing set, so just save this definition
      newFocusDefinition.focalSetDefinitionsId = values.focalSetDefinitionId;
      dispatch(createFocusDefinition(topicId, newFocusDefinition))
        .then((results) => {
          if ((results.status) && results.status === 500) {
            dispatch(updateFeedback({ open: true, message: focusNotSaved }));  // user feedback that it failed
          } else {
            dispatch(setTopicNeedsNewSnapshot(true));           // user feedback that snapshot is needed
            dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback that it worked
            dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
            dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
          }
        });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      dispatchProps.saveFocus(ownProps.topicId, values);
    },
  });
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
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
