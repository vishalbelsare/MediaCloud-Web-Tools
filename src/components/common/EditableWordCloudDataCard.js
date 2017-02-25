import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import messages from '../../resources/messages';
import OrderedWordCloud from '../vis/OrderedWordCloud';
import Permissioned from './Permissioned';
import { ExploreButton } from './IconButton';
import { getBrandDarkColor } from '../../styles/colors';
import { PERMISSION_LOGGED_IN } from '../../lib/auth';
import { downloadSvg } from '../util/svg';
import ActionMenu from './ActionMenu';

class EditableWordCloudDataCard extends React.Component {

  state = {
    editing: false, // the id of a collection to copy
    allModifiableWords: null,
    displayOnlyWords: null,
  };

  onEditModeClick = (d, node) => {
    // it is easiest to change the CSS of a svg text mode by classing the text node
    const text = node.nodes()[0];
    if (text.attributes.class.nodeValue === 'word left' || text.attributes.class.nodeValue === 'word left show') {
      text.attributes.class.nodeValue += ' hide';
    } else if (text.attributes.class.nodeValue === 'word left hide') {
      text.attributes.class.nodeValue = 'word left show';
    }
    if (this.state && this.state.modifiableWords) {
      const changeWord = this.state.modifiableWords.filter(w => (w.term === text.textContent));
      changeWord[0].display = !changeWord[0].display;
    }
  };

  toggleEditing = () => {
    const { words } = this.props;
    if (this.state) {
      // initialize copy of words

      if (this.state.modifiableWords == null) {
        const initializeDisplayOfWords = words.map(w => ({ ...w, display: true }));
        this.setState({ modifiableWords: initializeDisplayOfWords, displayOnlyWords: initializeDisplayOfWords });
      }
      // after initialization if not editing, filter words that say 'don't display'

      if (this.state.modifiableWords != null && this.state.editing) {
        const displayOnlyWords = this.state.modifiableWords.filter(w => w.display === true);
        this.setState({ displayOnlyWords });
      }

      this.setState({ editing: !this.state.editing });
    }
  };

  downloadCsv = () => {
    const { downloadUrl } = this.props;
    window.location = downloadUrl;
  };

  render() {
    const { words, onViewModeClick, width, height, maxFontSize, minFontSize, explore, helpButton, domId } = this.props;
    const { formatMessage } = this.props.intl;
    const defaultMenuItems = [
      { text: formatMessage(messages.editWordCloud), clickHandler: () => this.toggleEditing() },
      { text: formatMessage(messages.downloadCSV), clickHandler: this.downloadCsv },
      { text: formatMessage(messages.downloadSVG), clickHandler: () => downloadSvg(domId) },
    ];
    let className = null;
    let clickHandler = null;
    let wordsArray = words.map(w => ({ ...w, display: true }));
    if (this.state && this.state.editing && this.state.modifiableWords) {
      clickHandler = this.onEditModeClick;
      className = 'editable-word-cloud editing';
      wordsArray = this.state.modifiableWords;
    } else if (this.state && !this.state.editing && this.state.displayOnlyWords) {
      clickHandler = onViewModeClick;
      className = 'editable-word-cloud';
      wordsArray = this.state.displayOnlyWords;
    }
    return (
      <DataCard className={className}>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={explore} />
            <ActionMenu actionItems={defaultMenuItems} useBackgroundColor />
          </div>
        </Permissioned>
        <h2>
          {helpButton}
        </h2>
        <OrderedWordCloud
          words={wordsArray}
          textColor={getBrandDarkColor()}
          width={width}
          height={height}
          maxFontSize={maxFontSize}
          minFontSize={minFontSize}
          onWordClick={clickHandler}
          domId={domId}
        />
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
  title: React.PropTypes.object.isRequired,
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
