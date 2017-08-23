import React from 'react';
import { injectIntl } from 'react-intl';
import Title from 'react-title-component';
import AppContainer from '../AppContainer';
import ExplorerDrawer from './ExplorerDrawer';
import messages from '../../resources/messages';

const ExplorerApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.explorerToolName)} | ${parentTitle}`;
  const drawer = <ExplorerDrawer />;
  return (
    <div>
      <Title render={titleHandler} />
      <AppContainer
        name="explorer"
        title={formatMessage(messages.explorerToolName)}
        description={formatMessage(messages.explorerToolDescription)}
        drawer={drawer}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

ExplorerApp.propTypes = {
  children: React.PropTypes.node,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    ExplorerApp
  );
