import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ConfirmKeywordSearchContainer from './keywordSearch/ConfirmKeywordSearchContainer';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../lib/focalTechniques';

const localMessages = {
  unimplemented: { id: 'focus.create.confirm.unimplemented', defaultMessage: 'Unimplemented' },
};

class CreateFocusConfirmContainer extends React.Component {

  render() {
    const { topicId, properties } = this.props;
    let content = null;
    if (properties.focalTechnique === FOCAL_TECHNIQUE_BOOLEAN_QUERY) {
      content = <ConfirmKeywordSearchContainer topicId={topicId} />;
    } else {
      content = <FormattedMessage {...localMessages.unimplemented} />;
    }
    return (
      <div>
        { content }
      </div>
    );
  }

}

CreateFocusConfirmContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  properties: state.topics.selected.focalSets.create.properties,
});

export default
  connect(mapStateToProps)(
    injectIntl(
      CreateFocusConfirmContainer
    )
  );
