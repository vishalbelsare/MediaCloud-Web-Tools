import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Link from 'react-router/lib/Link';
import Divider from 'material-ui/Divider';
import DataCard from './DataCard';
import messages from '../../resources/messages';
import OrderedWordCloud from '../vis/OrderedWordCloud';
import WordCloud from '../vis/WordCloud';
import Word2VecChart from '../vis/Word2VecChart';
import Permissioned from './Permissioned';
import { DownloadButton, ExploreButton, EditButton } from './IconButton';
import { getBrandDarkColor } from '../../styles/colors';
import { PERMISSION_LOGGED_IN } from '../../lib/auth';
import { downloadSvg } from '../util/svg';
import ActionMenu from './ActionMenu';
import { WarningNotice } from '../common/Notice';

const VIEW_CLOUD = 'VIEW_CLOUD';
const VIEW_ORDERED = 'VIEW_ORDERED';
const VIEW_GOOGLE_W2V = 'VIEW_GOOGLE_W2V';
const VIEW_TOPIC_W2V = 'VIEW_TOPIC_W2V';

const localMessages = {
  editing: { id: 'wordcloud.editable.editingNotice', defaultMessage: 'You are temporarily editing this word cloud. Click words you want to hide, then use the menu to flip back into view mode and export it to SVG.' },
  edited: { id: 'wordcloud.editable.edited', defaultMessage: 'You have temporarily edited this word cloud to remove some of the words. Your changes will be lost when you leave this page.' },
  modeOrdered: { id: 'wordcloud.editable.mode.ordered', defaultMessage: 'View Ordered Layout (default)' },
  modeCloud: { id: 'wordcloud.editable.mode.unordered', defaultMessage: 'View Cloud Layout' },
  modeTopicW2V: { id: 'wordcloud.editable.mode.topicW2V', defaultMessage: 'View Topic Specific Word2Vec 2D Layout' },
  modeGoogleW2V: { id: 'wordcloud.editable.mode.googleW2V', defaultMessage: 'View GoogleNews Word2Vec 2D Layout' },
  invalidView: { id: 'wordcloud.editable.mode.invalid', defaultMessage: 'Sorry, but an invalid view is selected' },
  downloadWordCSV: { id: 'wordcount.editable.download.wordCsv', defaultMessage: 'Download Word Frequency CSV' },
  downloadBigramCSV: { id: 'wordcount.editable.download.brigramCsv', defaultMessage: 'Download Bigram Frequency CSV' },
  downloadTrigramCSV: { id: 'wordcount.editable.download.trigramCsv', defaultMessage: 'Download Trigram Frequency CSV' },
};

class EditableWordCloudDataCard extends React.Component {

  state = {
    editing: false,   // whether you are editing right now or not
    modifiableWords: null, // all the words, including a boolean display property on each
    displayOnlyWords: null, // only the words that are being displayed
    view: VIEW_ORDERED, // which view to show (see view constants above)
  };

  onEditModeClick = (d, node) => {
    const text = node.nodes()[0];
    if (this.state.modifiableWords) {
      const changeWord = this.state.modifiableWords.filter(w => (w.term === text.textContent));
      changeWord[0].display = !changeWord[0].display;
      this.setState({ modifiableWords: [...this.state.modifiableWords] });  // reset this to trigger a re-render
    }
  };

  setView = (nextView) => {
    this.setState({ view: nextView });
  }

  isShowingAllWords = () => (this.state.modifiableWords.length === this.state.displayOnlyWords.length);

  toggleEditing = () => {
    const { words } = this.props;
    // initialize copy of words so we have the display tag set
    if (this.state.modifiableWords == null) {
      const initializeDisplayOfWords = words.map(w => ({ ...w, display: true }));
      const initializeDisplayOnlyWords = words.map(w => ({ ...w, display: true }));
      this.setState({ modifiableWords: initializeDisplayOfWords, displayOnlyWords: initializeDisplayOnlyWords });
    }
    // after initialization if not editing, filter words that say 'don't display'
    if (this.state.modifiableWords != null && this.state.editing) {
      const displayOnlyWords = this.state.modifiableWords.filter(w => w.display === true);
      this.setState({ displayOnlyWords });
    }
    this.setState({ editing: !this.state.editing });
  };

  downloadCsv = (ngramSize) => {
    const { downloadUrl } = this.props;
    let url = downloadUrl;
    if (ngramSize) {
      url = `${url}&ngram_size=${ngramSize}`;
    }
    window.location = url;
  };

  render() {
    const { title, words, onViewModeClick, width, height, maxFontSize, minFontSize, explore, helpButton, domId,
      subtitleContent, includeTopicWord2Vec } = this.props;
    const { formatMessage } = this.props.intl;
    let className = 'editable-word-cloud-datacard';
    let editingClickHandler = onViewModeClick;
    let wordsArray = words.map(w => ({ ...w, display: true }));
    let editingWarning;
    const uniqueDomId = `${domId}-${(this.state.ordered ? 'ordered' : 'unordered')}`; // add mode to it so ordered or not works
    if (this.state.editing && this.state.modifiableWords) {
      editingClickHandler = this.onEditModeClick;
      className += ' editing';
      wordsArray = this.state.modifiableWords;
      editingWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.editing} /></WarningNotice>);
    } else if (!this.state.editing && this.state.displayOnlyWords) {
      editingClickHandler = onViewModeClick;
      wordsArray = this.state.displayOnlyWords;
      if (!this.isShowingAllWords()) {
        editingWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.edited} /></WarningNotice>);
      }
    }

    let titleContent = title;
    if (explore) {
      titleContent = (
        <Link to={explore}>
          {title}
        </Link>
      );
    }
    // set up rendered cloud as appropriate
    let cloudContent;
    switch (this.state.view) {
      case VIEW_ORDERED:
        cloudContent = (
          <OrderedWordCloud
            words={wordsArray}
            textColor={getBrandDarkColor()}
            width={width}
            height={height}
            maxFontSize={maxFontSize}
            minFontSize={minFontSize}
            onWordClick={editingClickHandler}
            domId={uniqueDomId}
          />
        );
        break;
      case VIEW_CLOUD:
        cloudContent = (
          <WordCloud
            words={wordsArray}
            textColor={getBrandDarkColor()}
            width={width}
            height={height}
            maxFontSize={maxFontSize}
            minFontSize={minFontSize}
            onWordClick={editingClickHandler}
            domId={uniqueDomId}
          />
        );
        break;
      case VIEW_GOOGLE_W2V:
        cloudContent = (
          <Word2VecChart
            words={wordsArray.slice(0, 100)}  // can't draw too many as it gets unreadable
            domId={uniqueDomId}
            width={width}
            height={height}
            xProperty="google_w2v_x"
            yProperty="google_w2v_y"
          />
        );
        break;
      case VIEW_TOPIC_W2V:
        cloudContent = (
          <Word2VecChart
            words={wordsArray.slice(0, 100)}  // can't draw too many as it gets unreadable
            domId={uniqueDomId}
            width={width}
            height={height}
            xProperty="w2v_x"
            yProperty="w2v_y"
          />
        );
        break;
      default:
        cloudContent = (<FormattedMessage {...localMessages.invalidView} />);
        break;
    }
    const exploreButton = explore ? (<ExploreButton linkTo={explore} />) : null;
    let topicWord2VecMenuItem;
    if (includeTopicWord2Vec) {
      topicWord2VecMenuItem = (
        <MenuItem
          className="action-icon-menu-item"
          primaryText={formatMessage(localMessages.modeTopicW2V)}
          disabled={this.state.editing || this.state.view === VIEW_TOPIC_W2V}
          onTouchTap={() => this.setView(VIEW_TOPIC_W2V)}
        />
      );
    }
    return (
      <DataCard className={className}>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            {exploreButton}
            <ActionMenu>
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.modeOrdered)}
                disabled={this.state.editing || this.state.view === VIEW_ORDERED}
                onTouchTap={() => this.setView(VIEW_ORDERED)}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.modeCloud)}
                disabled={this.state.editing || this.state.view === VIEW_CLOUD}
                onTouchTap={() => this.setView(VIEW_CLOUD)}
              />
              {topicWord2VecMenuItem}
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.modeGoogleW2V)}
                disabled={this.state.editing || this.state.view === VIEW_GOOGLE_W2V}
                onTouchTap={() => this.setView(VIEW_GOOGLE_W2V)}
              />
              <Divider />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(this.state.editing ? messages.viewWordCloud : messages.editWordCloud)}
                rightIcon={(this.state.view === VIEW_ORDERED) ? <EditButton /> : undefined}
                disabled={this.state.view !== VIEW_ORDERED} // can only edit in ordered mode
                onTouchTap={this.toggleEditing}
              />
              <Divider />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadWordCSV)}
                rightIcon={<DownloadButton />}
                disabled={this.state.editing} // can't download until done editing
                onTouchTap={() => this.downloadCsv(1)}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadBigramCSV)}
                rightIcon={<DownloadButton />}
                disabled={this.state.editing} // can't download until done editing
                onTouchTap={() => this.downloadCsv(2)}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadTrigramCSV)}
                rightIcon={<DownloadButton />}
                disabled={this.state.editing} // can't download until done editing
                onTouchTap={() => this.downloadCsv(3)}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(messages.downloadSVG)}
                rightIcon={<DownloadButton />}
                disabled={this.state.editing} // can't download until done editing
                onTouchTap={() => {
                  if (this.state.ordered) { // tricky to get the correct element to serialize
                    downloadSvg(uniqueDomId);
                  } else {
                    const svgChild = document.getElementById(uniqueDomId);
                    downloadSvg(svgChild.firstChild);
                  }
                }}
              />
            </ActionMenu>
          </div>
        </Permissioned>

        <h2>
          {titleContent}
          {helpButton}
          {subtitleContent}
        </h2>
        {editingWarning}
        {cloudContent}
      </DataCard>
    );
  }
}

EditableWordCloudDataCard.propTypes = {
  // from parent
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  title: PropTypes.string.isRequired,
  words: PropTypes.array.isRequired,
  itemId: PropTypes.string,
  downloadUrl: PropTypes.string,
  explore: PropTypes.object,
  download: PropTypes.func,
  helpButton: PropTypes.node,
  targetURL: PropTypes.string,
  subtitleContent: PropTypes.object,
  includeTopicWord2Vec: PropTypes.bool,
    // from dispatch
  onViewModeClick: PropTypes.func.isRequired,
  domId: PropTypes.string.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      EditableWordCloudDataCard
    )
  );
