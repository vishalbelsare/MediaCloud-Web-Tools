import React from 'react';
// import Glossary from '../../../server/templates/glossary_of_terms.html';



class glossary extends React.Component {
  // getStyles() {
  // }
  render() {
    const { something } = this.props;
    // const styles = this.getStyles();
    return (
   <div id="glossary">
    <section>
    <h3>Frame</h3>
      <article>
        <h4>What do we mean by a Frame?</h4>
      </article>
    </section>
    <section >
      <h3>Collections</h3>
    </section >
    <section >
      <h3>Controversy</h3>
    </section >
     <section >
      <h3>Geotagging</h3>
        <article>
          <h4>What is tagged with geo info</h4>
        </article> 
      </section>
    <section >
      <h3>Sentences</h3>
        <article>
          <h4>Sentences over Time</h4>
        </article> 
      </section>
    <section >
      <h3>Sources</h3>
    </section>
    <section >
      <h3>Story</h3>
    </section>
    <section >
      <h3>Topic</h3>
    </section>
    <section >
      <h3>Topic Mapper</h3>
    </section>
    <section >
      <h3>Words</h3>
    </section>


  </div>
    );
  }
}

glossary.propTypes = {
  something: React.PropTypes.string,
};

export default glossary;
