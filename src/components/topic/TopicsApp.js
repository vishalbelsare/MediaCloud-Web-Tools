import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Title from 'react-title-component';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const TopicsApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.topicsToolName)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <AppContainer
        name="topics"
        title={formatMessage(messages.topicsToolName)}
        description={formatMessage(messages.topicsToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

TopicsApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicsApp
  );
