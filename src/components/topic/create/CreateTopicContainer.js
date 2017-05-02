import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../../resources/messages';
import TopicBuilderWizard from './TopicBuilderWizard';


const CreateTopicContainer = (props) => {
  const { formatMessage } = props.intl;
  const initialValues = { start_date: '2017-01-02', end_date: '2017-12-31', max_iterations: 15, buttonLabel: formatMessage(messages.save) };

  return (
    <TopicBuilderWizard
      startStep={0}
      initialValues={initialValues}
      location={location}
    />
  );
};

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
