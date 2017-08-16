import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';
import FocusBuilderWizard from './builder/FocusBuilderWizard';
import { submitFocusUpdateOrCreate, setTopicNeedsNewSnapshot } from '../../../../actions/topicActions';
import { updateFeedback } from '../../../../actions/appActions';

const localMessages = {
  focusSaved: { id: 'focus.create.saved', defaultMessage: 'We saved your new Subtopic.' },
  focusNotSaved: { id: 'focus.create.notSaved', defaultMessage: 'That didn\'t work for some reason!' },
};

const CreateFocusContainer = (props) => {
  const { topicId, location, handleDone } = props;
  const { focalSetDefId, focalTechnique } = props.location.query;
  const initialValues = {};
  if (focalTechnique !== undefined) {
    initialValues.focalTechnique = focalTechnique;
  }
  // if there aren't any focal set defs, the user should have to create a new one
  if (focalSetDefId !== undefined) {
    initialValues.focalSetDefinitionId = focalSetDefId;
  }
  return (
    <FocusBuilderWizard
      topicId={topicId}
      startStep={0}
      initialValues={initialValues}
      location={location}
      onDone={handleDone}
    />
  );
};

CreateFocusContainer.propTypes = {
  // from dispatch
  handleDone: PropTypes.func.isRequired,
  // from context:
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDone: (topicId, formValues) => {
    dispatch(submitFocusUpdateOrCreate(topicId, formValues))
      .then((results) => {
        if (results.length === 1) {
          const focusSavedMessage = ownProps.intl.formatMessage(localMessages.focusSaved);
          dispatch(setTopicNeedsNewSnapshot(true));           // user feedback
          dispatch(updateFeedback({ open: true, message: focusSavedMessage }));  // user feedback
          dispatch(push(`/topics/${topicId}/snapshot/foci`)); // go back to focus management page
          dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
        } else {
          const focusNoteSavedMessage = ownProps.intl.formatMessage(localMessages.focusNotSaved);
          dispatch(updateFeedback({ open: true, message: focusNoteSavedMessage }));  // user feedback
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateFocusContainer
    )
  );
