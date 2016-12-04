import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FocusBuilderWizard from './builder/FocusBuilderWizard';

const CreateFocusContainer = (props) => {
  const { topicId, location } = props;
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
    />
  );
};

CreateFocusContainer.propTypes = {
  // from context:
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

export default
  injectIntl(
    connect(mapStateToProps)(
      CreateFocusContainer
    )
  );
