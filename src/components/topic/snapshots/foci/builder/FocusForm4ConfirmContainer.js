import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import composeIntlForm from '../../../../common/IntlForm';
import KeywordSearchSummary from './keywordSearch/KeywordSearchSummary';
import RetweetPartisanshipSummary from './retweetPartisanship/RetweetPartisanshipSummary';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY, FOCAL_TECHNIQUE_RETWEET_PARTISANSHIP } from '../../../../../lib/focalTechniques';
import AppButton from '../../../../common/AppButton';
import messages from '../../../../../resources/messages';
import { createFocalSetDefinition, setTopicNeedsNewSnapshot, createFocusDefinition, goToCreateFocusStep }
  from '../../../../../actions/topicActions';
import { updateFeedback } from '../../../../../actions/appActions';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocusDescriptionForm';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your Subtopic Changes' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Technique</b>: {name}' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add More' },
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
      content = (
        <KeywordSearchSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    case FOCAL_TECHNIQUE_RETWEET_PARTISANSHIP:
      content = (
        <RetweetPartisanshipSummary topicId={topicId} formValues={formValues} initialValues={initialValues} />
      );
      break;
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
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
            <h3><FormattedHTMLMessage {...localMessages.focalTechnique} values={{ name: formValues.focalTechnique }} /></h3>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
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
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  // form context
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool,
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
