import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import AppButton from '../../../../../common/AppButton';
import { createFocalSetDefinition, setTopicNeedsNewSnapshot, createFocusDefinition, setNewFocusProperties }
  from '../../../../../../actions/topicActions';
import { updateFeedback } from '../../../../../../actions/appActions';
import { INITIAL_STATE } from '../../../../../../reducers/topics/selected/focalSets/create/properties';
import messages from '../../../../../../resources/messages';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from '../FocusDetailsForm';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your New "{name}" Focus' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Focal Technique</b>: {name}' },
  keywords: { id: 'focus.create.confirm.keywords', defaultMessage: '<b>Keywords</b>: {keywords}' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Focus' },
  focalSetSaved: { id: 'focalSet.saved', defaultMessage: 'We saved your new Focal Set.' },
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Focus.' },
};

const ConfirmKeywordSearchContainer = (props) => {
  const { saveAndAddAnother, properties } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.title} values={{ name: properties.name }} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ul>
            <li><FormattedHTMLMessage {...localMessages.name} values={{ name: properties.name }} /></li>
            <li><FormattedHTMLMessage {...localMessages.description} values={{ description: properties.description }} /></li>
            <li><FormattedHTMLMessage {...localMessages.focalTechnique} values={{ name: properties.focalTechnique }} /></li>
            <li><FormattedHTMLMessage {...localMessages.keywords} values={{ keywords: properties.keywords }} /></li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <AppButton primary label={formatMessage(localMessages.addAnotherFocus)} onClick={saveAndAddAnother} />
        </Col>
      </Row>
    </Grid>
  );
};

ConfirmKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dispatch
  saveFocus: React.PropTypes.func.isRequired,
  // from mergeProps
  saveAndAddAnother: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveFocus: (topicId, properties, focalSetSavedMessage, focusSavedMessage) => {
    const newFocusDefinition = {
      name: properties.name,
      description: properties.description,
      query: properties.keywords,
    };
    if (properties.focalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
      const newFocalSetDefinition = {
        name: properties.focalSetName,
        description: properties.focalSetDescription,
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
      ConfirmKeywordSearchContainer
    )
  );
