import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import messages from '../../../resources/messages';
import TopicBuilderWizard from './TopicBuilderWizard';

const CreateTopicContainer = () => (
  <TopicBuilderWizard
    startStep={0}
    // initialValues={initialValues}
    location={location}
  />
);
CreateTopicContainer.propTypes = {
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    connect(null)(
      CreateTopicContainer
    )
  );
