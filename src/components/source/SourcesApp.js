import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Title from 'react-title-component';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const SourcesApp = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.sourcesToolName)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <AppContainer
        name="sources"
        title={formatMessage(messages.sourcesToolName)}
        description={formatMessage(messages.sourcesToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

SourcesApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    SourcesApp
  );
