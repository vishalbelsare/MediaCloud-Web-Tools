import React from 'react';
import Title from 'react-title-component';

function About() {
  return (
    <div>
      <Title render={parentTitle => `About | ${parentTitle}`}/>
      <h1>About</h1>;
    </div>
  )
}
 
export default About;