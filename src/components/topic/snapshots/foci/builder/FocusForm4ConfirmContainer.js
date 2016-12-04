import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import KeywordSearchSummary from './keywordSearch/KeywordSearchSummary';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';
import AppButton from '../../../../common/AppButton';
import messages from '../../../../../resources/messages';
import { createFocalSetDefinition, setTopicNeedsNewSnapshot, createFocusDefinition, setNewFocusProperties, goToCreateFocusStep }
  from '../../../../../actions/topicActions';
import { updateFeedback } from '../../../../../actions/appActions';
import { INITIAL_STATE } from '../../../../../reducers/topics/selected/focalSets/create/properties';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocusDescriptionForm';

const localMessages = {
  unimplemented: { id: 'focus.create.confirm.unimplemented', defaultMessage: 'Unimplemented' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Focus' },
  focalSetSaved: { id: 'focalSet.saved', defaultMessage: 'We saved your new Focal Set.' },
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Focus.' },
};

const FocusForm4ConfirmContainer = (props) => {
  const { topicId, properties, initialValues, handlePreviousStep, saveAndAddAnother } = props;
  const { formatMessage } = props.intl;
  let content = null;
  switch (properties.focalTechnique) {
    case FOCAL_TECHNIQUE_BOOLEAN_QUERY:
      content = <KeywordSearchSummary topicId={topicId} properties={properties} initialValues={initialValues} />;
      break;
    default:
      content = <FormattedMessage {...localMessages.unimplemented} />;
  }
  return (
    <Grid>
      { content }
      <Row>
        <Col lg={12}>
          <AppButton label={formatMessage(messages.previous)} onClick={handlePreviousStep} />
          &nbsp; &nbsp;
          <AppButton primary label={formatMessage(localMessages.addAnotherFocus)} onClick={saveAndAddAnother} />
        </Col>
      </Row>
    </Grid>
  );
};

FocusForm4ConfirmContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dispatch
  saveAndAddAnother: React.PropTypes.func.isRequired,
  handlePreviousStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreateFocusStep(2));
  },
  saveFocus: (topicId, properties, focalSetSavedMessage, focusSavedMessage) => {
    const newFocusDefinition = {
      focusName: properties.focusName,
      focusDescription: properties.focusDescription,
      keywords: properties.keywords,
    };
    if (properties.focalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
      const newFocalSetDefinition = {
        focalSetName: properties.focalSetName,
        focalSetDescription: properties.focalSetDescription,
        focalTechnique: properties.focalTechnique,
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
              dispatch(setNewFocusProperties(INITIAL_STATE));     // reset properties
              dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
              dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
              dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
            });
        });
    } else {
      newFocusDefinition.focalSetDefinitionsId = properties.focalSetDefinitionId;
      dispatch(createFocusDefinition(topicId, newFocusDefinition))
        .then(() => {
          // TODO: check results to make sure it worked before proceeding
          dispatch(setNewFocusProperties(INITIAL_STATE));     // reset properties
          dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
          dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
          dispatch(push(`/topics/${ownProps.topicId}/snapshot/foci`)); // go back to focus management page
        });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveAndAddAnother: () => {
      dispatchProps.saveFocus(ownProps.topicId, stateProps.properties,
        ownProps.intl.formatMessage(localMessages.focalSetSaved),
        ownProps.intl.formatMessage(localMessages.focusSaved),
        false, ownProps.intl.formatMessage(messages.snapshotGenerating)
      );
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      FocusForm4ConfirmContainer
    )
  );
