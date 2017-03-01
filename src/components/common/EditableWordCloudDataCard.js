import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import messages from '../../resources/messages';
import EditableOrderedWordCloud from '../vis/EditableOrderedWordCloud';
import WordCloud from '../vis/WordCloud';
import Permissioned from './Permissioned';
import { DownloadButton, ExploreButton, EditButton } from './IconButton';
import { getBrandDarkColor } from '../../styles/colors';
import { PERMISSION_LOGGED_IN } from '../../lib/auth';
import { downloadSvg } from '../util/svg';
import ActionMenu from './ActionMenu';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  aboutEditing: { id: 'wordcloud.editable.editingNotice', defaultMessage: 'You are temporarily editing this word cloud. Click words you want to hide, then use the menu to flip back into view mode and export it to SVG.' },
  modeOrdered: { id: 'wordcloud.editable.mode.ordered', defaultMessage: 'Use Ordered Layout' },
  modeUnordered: { id: 'wordcloud.editable.mode.unordered', defaultMessage: 'Use Cloud Layout' },
};

class EditableWordCloudDataCard extends React.Component {

  state = {
    editing: false,
    allModifiableWords: null,
    displayOnlyWords: null,
    ordered: true,
  };

  onEditModeClick = (d, node) => {
    // it is easiest to change the CSS of a svg text mode by classing the text node
    const text = node.nodes()[0];
    if (text.attributes.class.nodeValue === 'word left' || text.attributes.class.nodeValue === 'word left show') {
      text.attributes.class.nodeValue = 'word left hide';
    } else if (text.attributes.class.nodeValue === 'word left hide') {
      text.attributes.class.nodeValue = 'word left show';
    }
    if (this.state.modifiableWords) {
      const changeWord = this.state.modifiableWords.filter(w => (w.term === text.textContent));
      changeWord[0].display = !changeWord[0].display;
    }
  };

  toggleOrdered = () => {
    this.setState({ ordered: !this.state.ordered });
  }

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

  downloadCsv = () => {
    const { downloadUrl } = this.props;
    window.location = downloadUrl;
  };

  render() {
    const { title, words, onViewModeClick, width, height, maxFontSize, minFontSize, explore, helpButton, domId } = this.props;
    const { formatMessage } = this.props.intl;
    let className = 'editable-word-cloud-datacard';
    let editingClickHandler = onViewModeClick;
    let wordsArray = words.map(w => ({ ...w, display: true }));
    let editingWarning;
    const editActionIcon = (<EditButton />);
    const uniqueDomId = `${domId}-${(this.state.ordered ? 'ordered' : 'unordered')}`; // add mode to it so ordered or not works
    if (this.state.editing && this.state.modifiableWords) {
      editingClickHandler = this.onEditModeClick;
      className = 'editable-word-cloud-datacard editing';
      wordsArray = this.state.modifiableWords;
      editingWarning = (<WarningNotice><FormattedHTMLMessage {...localMessages.aboutEditing} /></WarningNotice>);
    } else if (!this.state.editing && this.state.displayOnlyWords) {
      editingClickHandler = onViewModeClick;
      className = 'editable-word-cloud-datacard';
      wordsArray = this.state.displayOnlyWords;
    }
    const defaultMenuItems = [
      { text: formatMessage(this.state.editing ? messages.viewWordCloud : messages.editWordCloud),
        icon: editActionIcon,
        clickHandler: this.toggleEditing },
      { text: formatMessage(this.state.ordered ? localMessages.modeUnordered : localMessages.modeOrdered),
        clickHandler: this.toggleOrdered },
      { text: formatMessage(messages.downloadCSV), clickHandler: this.downloadCsv, icon: <DownloadButton /> },
      { text: formatMessage(messages.downloadSVG),
        icon: <DownloadButton />,
        clickHandler: () => {
          if (this.state.ordered) { // tricky to get the correct element to serialize
            downloadSvg(uniqueDomId);
          } else {
            const svgChild = document.getElementById(uniqueDomId);
            downloadSvg(svgChild.firstChild);
          }
        },
      },
    ];
    // set up rendered cloud as appropriate
    let cloudContent;
    if (this.state.ordered) {
      cloudContent = (
        <EditableOrderedWordCloud
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
    } else {
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
    }
    return (
      <DataCard className={className}>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={explore} />
            <ActionMenu actionItems={defaultMenuItems} />
          </div>
        </Permissioned>
        <h2>
          {title}
          {helpButton}
        </h2>
        {editingWarning}
        {cloudContent}
      </DataCard>
    );
  }
}

EditableWordCloudDataCard.propTypes = {
  // from parent
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
  itemId: React.PropTypes.string,
  downloadUrl: React.PropTypes.string,
  explore: React.PropTypes.object,
  download: React.PropTypes.func,
  helpButton: React.PropTypes.node,
    // from dispatch
  onViewModeClick: React.PropTypes.func.isRequired,
  domId: React.PropTypes.string.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      EditableWordCloudDataCard
    )
  );
