import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { storyPubDateToTimestamp } from '../../lib/dateUtil';

const localMessages = {
  undateable: { id: 'story.publishDate.undateable', defaultMessage: 'Undateable' },
  foci: { id: 'story.foci.list', defaultMessage: 'List of Subtopics {list}' },
  viewArticle: { id: 'story.foci.viewArticle', defaultMessage: '(view article)' },
};

const StorySentencePreview = (props) => {
  const { stories } = props;
  const { formatMessage, formatDate } = props.intl;
  return (
    <div className="story-sentence-preview">
      {stories.map((story, idx) => {
        let dateToShow = null;  // need to handle undateable stories
        if (story.publish_date === 'undateable') {
          dateToShow = formatMessage(localMessages.undateable);
        } else {
          dateToShow = formatDate(storyPubDateToTimestamp(story.publish_date));
          if (story.date_is_reliable === 0) {
            dateToShow += '?';
          }
        }
        return (
          <div key={idx} className="story-sentence-preview-item">
            <h3>{`${story.medium_name} - ${dateToShow} `}<a href={story.url} rel="noopener noreferrer" target="_blank"><FormattedMessage {...localMessages.viewArticle} /></a></h3>
            <p>{`"...${story.sentence}..."`}</p>
          </div>
        );
      })};
    </div>
  );
};

StorySentencePreview.propTypes = {
  stories: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
  onChangeFocusSelection: PropTypes.func,
  sortedBy: PropTypes.string,
  maxTitleLength: PropTypes.number,
};

export default injectIntl(StorySentencePreview);
