import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../../common/IntlForm';
import KeywordSearchSummary from './keywordSearch/KeywordSearchSummary';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';
import AppButton from '../../../../common/AppButton';
import messages from '../../../../../resources/messages';
import { goToCreateFocusStep } from '../../../../../actions/topicActions';
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
            <h2><FormattedMessage {...localMessages.title} values={{ name: formValues.focusName }} /></h2>
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
  onDone: PropTypes.func.isRequired,
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
    ownProps.onDone(topicId, values);
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
