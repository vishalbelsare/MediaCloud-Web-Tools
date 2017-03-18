import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import messages from '../../resources/messages';
import OrderedWordCloud from '../vis/OrderedWordCloud';
import WordCloud from '../vis/WordCloud';
import Permissioned from './Permissioned';
import { DownloadButton, ExploreButton, EditButton } from './IconButton';
import { getBrandDarkColor } from '../../styles/colors';
import { PERMISSION_LOGGED_IN } from '../../lib/auth';
import { downloadSvg } from '../util/svg';
import ActionMenu from './ActionMenu';
import { WarningNotice } from '../common/Notice';

const localMessages = {
  editing: { id: 'wordcloud.editable.editingNotice', defaultMessage: 'You are temporarily editing this word cloud. Click words you want to hide, then use the menu to flip back into view mode and export it to SVG.' },
  edited: { id: 'wordcloud.editable.edited', defaultMessage: 'You have temporarily edited this word cloud to remove some of the words. Your changes will be lost when you leave this page.' },
  modeOrdered: { id: 'wordcloud.editable.mode.ordered', defaultMessage: 'Use Ordered Layout' },
  modeUnordered: { id: 'wordcloud.editable.mode.unordered', defaultMessage: 'Use Cloud Layout' },
};

class EditableWordCloudDataCard extends React.Component {

  state = {
    editing: false,   // whether you are editing right now or not
    modifiableWords: null, // all the words, including a boolean display property on each
    displayOnlyWords: null, // only the words that are being displayed
    ordered: true,  // whether you are showing an ordered word cloud or circular layout word cloud
  };

  onEditModeClick = (d, node) => {
    const text = node.nodes()[0];
    if (this.state.modifiableWords) {
      const changeWord = this.state.modifiableWords.filter(w => (w.term === text.textContent));
      changeWord[0].display = !changeWord[0].display;
      this.setState({ modifiableWords: [...this.state.modifiableWords] });  // reset this to trigger a re-render
    }
  };

  toggleOrdered = () => {
    this.setState({ ordered: !this.state.ordered });
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
    const defaultMenuItems = [
      { text: formatMessage(this.state.editing ? messages.viewWordCloud : messages.editWordCloud),
        icon: editActionIcon,
        disabled: !this.state.ordered,  // can't edit for now in cloud layout
        clickHandler: this.toggleEditing,
      },
      { text: formatMessage(this.state.ordered ? localMessages.modeUnordered : localMessages.modeOrdered),
        disabled: this.state.editing, // can't edit for now in cloud layout
        clickHandler: this.toggleOrdered,
      },
      { text: formatMessage(messages.downloadCSV),
        icon: <DownloadButton />,
        disabled: this.state.editing, // can't download until done editing
        clickHandler: this.downloadCsv,
      },
      { text: formatMessage(messages.downloadSVG),
        icon: <DownloadButton />,
        disabled: this.state.editing, // can't download until done editing
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
    const exploreButton = explore ? (<ExploreButton linkTo={explore} />) : null;
    return (
      <DataCard className={className}>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            {exploreButton}
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
