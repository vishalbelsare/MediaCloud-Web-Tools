import React from 'react';

class WordCloud extends React.Component {

  render() {
    const { words } = this.props;
    return (
      <div>
        {words.length}
      </div>
    );
  }

}

WordCloud.propTypes = {
  words: React.PropTypes.array.isRequired,
};

export default WordCloud;
