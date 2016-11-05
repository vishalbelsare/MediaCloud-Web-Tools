import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { selectWord } from '../../../actions/topicActions';
import WordDetails from './WordDetails';
import WordWordsContainer from './WordWordsContainer';
import WordStoriesContainer from './WordStoriesContainer';
import WordSentenceCountContainer from './WordSentenceCountContainer';
import messages from '../../../resources/messages';

const localMessages = {
  mainTitle: { id: 'word.details.mainTitle', defaultMessage: 'Details for the word {title}' },
};

class WordContainer extends React.Component {

  state = {
    open: false,
  };

  componentWillMount() {
    const { selectNewWord } = this.props;
    const { topicId } = this.props.params;
    const { search } = this.props.location;

    const hashParts = search.split('?');
    const args = {};
    if (hashParts.length > 1) {
      const queryParts = hashParts[1].split('&');
      queryParts.forEach((part) => {
        const argParts = part.split('=');
        args[argParts[0]] = argParts[1];
      });

      if ('term' in args) {
        this.setState({ term: args.term });
      }
      if ('stem' in args) {
        this.setState({ stem: args.stem });
      }
      selectNewWord(topicId, args.stem);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { word } = this.props.params.word;
    this.setState({ term: word });
    if (nextProps.word !== this.props.word) {
      const { fetchData } = this.props;
      fetchData(nextProps.word);
    }
  }

  render() {
    const { topicId } = this.props;
    const term = this.state.term;
    const stem = this.state.stem;
    const { formatMessage } = this.props.intl;
    const titleHandler = `${formatMessage(messages.word)}`;

    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h1>
                <FormattedMessage {...localMessages.mainTitle} values={{ title: term }} />
              </h1>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <WordDetails topicId={topicId} term={term} stem={stem} />
            </Col>
            <Col lg={6} md={6} sm={12}>
              <WordSentenceCountContainer topicId={topicId} word={stem} />
            </Col>
            <Col lg={12}>
              <WordStoriesContainer topicId={topicId} word={stem} />
            </Col>
            <Col lg={6} md={6} sm={12}>
              <WordWordsContainer topicId={topicId} word={stem} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

WordContainer.propTypes = {
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  location: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  fetchData: React.PropTypes.func,
  // from state
  word: React.PropTypes.string,
  stem: React.PropTypes.string,
  term: React.PropTypes.string,
  topicId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  selectNewWord: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.topics.selected.word.info.fetchStatus,
  topicId: parseInt(ownProps.params.topicId, 10),
  dirtyword: ownProps.params.dirtyword,
  stem: ownProps.params.stem,
  term: ownProps.params.term,
});


const mapDispatchToProps = dispatch => ({
  selectNewWord: (topicId, word) => {
    dispatch(selectWord(topicId, word));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      WordContainer
    )
  );
