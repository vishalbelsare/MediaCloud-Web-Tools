import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import EditKeywordSearchContainer from './keywordSearch/EditKeywordSearchContainer';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../../actions/topicActions';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';

const localMessages = {
  unimplemented: { id: 'focus.create.edit.unimplemented', defaultMessage: 'Unimplemented' },
};

const FocusForm2ConfigureContainer = (props) => {
  const { topicId, properties, initialValues, handleFinishStep } = props;
  let content = null;
  switch (properties.focalTechnique) {
    case FOCAL_TECHNIQUE_BOOLEAN_QUERY:
      content = (<EditKeywordSearchContainer
        topicId={topicId}
        initialValues={initialValues}
        onFinishStep={handleFinishStep}
      />);
      break;
    default:
      content = <FormattedMessage {...localMessages.unimplemented} />;
  }
  return (
    <div>
      { content }
    </div>
  );
};

FocusForm2ConfigureContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dipatch
  handleFinishStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
});

const mapDispatchToProps = dispatch => ({
  handleFinishStep: (additionalProperties) => {
    dispatch(setNewFocusProperties(additionalProperties));
    dispatch(goToCreateFocusStep(2));
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(
      FocusForm2ConfigureContainer
    )
  );
