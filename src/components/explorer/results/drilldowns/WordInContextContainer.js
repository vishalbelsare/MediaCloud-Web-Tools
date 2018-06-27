import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import slugify from 'slugify';
import { Row, Col } from 'react-flexbox-grid/lib';
import ActionMenu from '../../../common/ActionMenu';
import { fetchWordSampleSentences } from '../../../../actions/explorerActions';
import withHelp from '../../../common/hocs/HelpfulContainer';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import DataCard from '../../../common/DataCard';
import WordTree from '../../../vis/WordTree';
import messages from '../../../../resources/messages';
import { downloadSvg } from '../../../util/svg';

const localMessages = {
  title: { id: 'word.inContext.title', defaultMessage: 'Word in Context: {word}' },
  helpTitle: { id: 'word.inContext.help.title', defaultMessage: 'About Word in Context' },
  helpText: { id: 'word.inContext.help.text',
    defaultMessage: '<p>It is helpful to look at how a word is used, in addition to the fact that it is used.  While a word cloud can tell you what words are used, this interactive visualization can help you explore the use of a word in context.</p>',
  },
  close: { id: 'word.inContext.close', defaultMessage: 'Close' },
  addWordToAllQueries: { id: 'word.inContext.addWordToAllQueries', defaultMessage: 'Add This Word To All Queries' },
};

class WordInContextContainer extends React.Component {
  state = {
    imageUri: null,
  }
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if (nextProps.selectedWord !== this.props.selectedWord) {
      fetchData(nextProps);
    }
  }
  getUniqueDomId = () => 'word-in-context-';
  handleDownloadSvg = () => {
    const { selectedWord } = this.props;
    // a little crazy, but it works (we have to just walk the DOM rendered by the library we are using)
    const domId = this.getUniqueDomId();
    const svgNode = document.getElementById(domId).children[0].children[0].children[0].children[0];
    const svgDownloadPrefix = `${slugify(selectedWord)}-in-context`;
    downloadSvg(svgDownloadPrefix, svgNode);
  }
  render() {
    const { selectedWord, handleDrillDownAction, handleClose, fragments, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const uniqueDomId = this.getUniqueDomId();

    if (selectedWord) {
      return (
        <DataCard>
          <ActionMenu>
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.close)}
              onTouchTap={handleClose}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.addWordToAllQueries)}
              onTouchTap={handleDrillDownAction}
            />
          </ActionMenu>
          <h2>
            <FormattedMessage {...localMessages.title} values={{ word: selectedWord.term }} />
            {helpButton}
          </h2>
          <Row>
            <Col lg={12}>
              <WordTree
                domId={uniqueDomId}
                sentences={fragments}
                startWord={selectedWord.term}
                height="400px"
                width="700px"
              />
            </Col>
          </Row>
        </DataCard>
      );
    }
    return <div />;
  }
}

WordInContextContainer.propTypes = {
  // from parent
  selectedWord: PropTypes.object,
  handleDrillDownAction: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  // from store
  fragments: PropTypes.array,
  fetchData: PropTypes.func.isRequired,
  // from dispatch
  fetchStatus: PropTypes.string.isRequired,
    // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};


const mapStateToProps = state => ({
  fetchStatus: state.explorer.sampleSentencesByWord.fetchStatus,
  selectedWord: state.explorer.topWords.selectedWord,
  fragments: state.explorer.sampleSentencesByWord.fragments,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchWordSampleSentences(props.term));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.selectedWord);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withHelp(localMessages.helpTitle, [localMessages.helpText, messages.wordTreeHelpText])(
        withAsyncFetch(
          WordInContextContainer
        )
      )
    )
  );

