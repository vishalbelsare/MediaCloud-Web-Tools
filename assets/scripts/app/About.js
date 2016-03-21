import React from 'react';
import Title from 'react-title-component';

function About() {
  const titleHandler = parentTitle => `About | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1>About</h1>
    </div>
  );
}

export default About;
