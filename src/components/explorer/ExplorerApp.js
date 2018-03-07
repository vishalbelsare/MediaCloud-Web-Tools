import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Title from 'react-title-component';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const ExplorerApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.explorerToolName)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <AppContainer
        name="explorer"
        title={formatMessage(messages.explorerToolName)}
        description={formatMessage(messages.explorerToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

ExplorerApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    ExplorerApp
  );
