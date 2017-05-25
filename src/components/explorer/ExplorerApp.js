import React from 'react';
import { injectIntl } from 'react-intl';
import Title from 'react-title-component';
import AppContainer from '../AppContainer';
// import SourcesDrawer from './SourcesDrawer';
import messages from '../../resources/messages';

const ExplorerApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.dashboardToolName)} | ${parentTitle}`;
  // const drawer = <SourcesDrawer />;
  return (
    <div>
      <Title render={titleHandler} />
      <AppContainer
        name="explorer"
        title={formatMessage(messages.dashboardToolName)}
        description={formatMessage(messages.dashboardToolDescription)}
        // drawer={drawer}
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
