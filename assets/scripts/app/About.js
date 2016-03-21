import React from 'react';
import Title from 'react-title-component';
import {FormattedMessage} from 'react-intl';

const About = () => {
  const titleHandler = parentTitle => `About | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1><FormattedMessage id="about_title" defaultMessage="About"/></h1>
    </div>
  );
};

export default About;
