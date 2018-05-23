import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const ToolsApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.toolsAppName)} | ${parentTitle}`;
  return (
    <div>
      <Helmet><title>{titleHandler()}</title></Helmet>
      <AppContainer
        name="tools"
        title={formatMessage(messages.toolsAppName)}
        description={formatMessage(messages.toolsAppDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

ToolsApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    ToolsApp
  );
