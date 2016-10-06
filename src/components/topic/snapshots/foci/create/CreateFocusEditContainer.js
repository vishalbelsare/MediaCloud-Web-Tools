import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import EditKeywordSearchContainer from './keywordSearch/EditKeywordSearchContainer';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';

const localMessages = {
  unimplemented: { id: 'focus.create.edit.unimplemented', defaultMessage: 'Unimplemented' },
};

const CreateFocusEditContainer = (props) => {
  const { topicId, properties } = props;
  let content = null;
  if (properties.focalTechnique === FOCAL_TECHNIQUE_BOOLEAN_QUERY) {
    content = <EditKeywordSearchContainer topicId={topicId} />;
  } else {
    content = <FormattedMessage {...localMessages.unimplemented} />;
  }
  return (
    <div>
      { content }
    </div>
  );
};

CreateFocusEditContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      CreateFocusEditContainer
    )
  );
