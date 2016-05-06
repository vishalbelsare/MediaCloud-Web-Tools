import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

const messages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About' },
};

const About = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.aboutTitle)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1><FormattedMessage {...messages.aboutTitle} /></h1>
    </div>
  );
};

About.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(About);
