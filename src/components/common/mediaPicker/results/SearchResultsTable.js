import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import React from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import * as fetchConstants from '../../../../lib/fetchConstants';
import { AddButton, DeleteButton } from '../../IconButton';
import { urlToCollection, urlToSource } from '../../../../lib/urlUtil';
// import MediaPickerPreviewList from '../MediaPickerPreviewList';

const localMessages = {
  name: { id: 'mediaPicker.searchResults.name', defaultMessage: 'Name' },
  storiesLastWeek: { id: 'mediaPicker.searchResults.storiesLastWeek', defaultMessage: 'Stories Last Week' },
  description: { id: 'mediaPicker.searchResults.description', defaultMessage: 'Description' },
  url: { id: 'mediaPicker.searchResults.url', defaultMessage: 'URL' },
  mediaSources: { id: 'mediaPicker.searchResults.mediaSources', defaultMessage: 'Media Sources' },
};

class SearchResultsTable extends React.Component {

  render() {
    const { title, whichMedia, handleToggleAndSelectMedia } = this.props;
    let content = null;
    if (whichMedia.storedKeyword !== null && whichMedia.storedKeyword !== undefined &&
      whichMedia.storedKeyword.mediaKeyword &&
      (whichMedia.fetchStatus === null || whichMedia.fetchStatus === fetchConstants.FETCH_ONGOING)) {
      content = <LoadingSpinner />;
    } else if (whichMedia && whichMedia.length > 0) {
      let tableContent;
      // render a table of collections or sources
      if (whichMedia[0].tags_id) {
        tableContent = (
          <table>
            <tbody>
              <tr>
                <th><FormattedMessage {...localMessages.name} /></th>
                <th><FormattedMessage {...localMessages.description} /></th>
                <th className="numeric"><FormattedMessage {...localMessages.storiesLastWeek} /></th>
                <th className="numeric"><FormattedMessage {...localMessages.mediaSources} /></th>
                <th />
              </tr>
              {whichMedia.map((c, idx) => {
                const ActionButton = c.selected ? DeleteButton : AddButton;
                const actionContent = <ActionButton onClick={() => handleToggleAndSelectMedia(c)} />;
                return (
                  <tr key={`${c.tags_id}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                    <td><a href={urlToCollection(c.tags_id)} target="new">{c.name}</a></td>
                    <td>{c.description}</td>
                    <td className="numeric"><FormattedNumber value={c.story_count} /></td>
                    <td className="numeric">{(c.media_count === 100) ? `${c.media_count}+` : c.media_count}</td>
                    <td>{actionContent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      } else {
        tableContent = (
          <table>
            <tbody>
              <tr>
                <th><FormattedMessage {...localMessages.name} /></th>
                <th><FormattedMessage {...localMessages.url} /></th>
                <th className="numeric"><FormattedMessage {...localMessages.storiesLastWeek} /></th>
                <th />
              </tr>
              {whichMedia.map((s, idx) => {
                const ActionButton = s.selected ? DeleteButton : AddButton;
                const actionContent = <ActionButton onClick={() => handleToggleAndSelectMedia(s)} />;
                return (
                  <tr key={`${s.media_id}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                    <td><a href={urlToSource(s.media_id)} target="new">{s.name}</a></td>
                    <td>{s.url}</td>
                    <td className="numeric"><FormattedNumber value={s.story_count} /></td>
                    <td>{actionContent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }
      content = (
        <div>
          <h2>{title}</h2>
          {tableContent}
          {/*
          <MediaPickerPreviewList
            items={whichMedia}
            classStyle="browse-items"
            itemType="media"
            linkInfo={c => `${whichMedia.type}/${c.tags_id || c.media_id}`}
            linkDisplay={c => `${c.name}`}
            onSelectMedia={c => handleToggleAndSelectMedia(c)}
          />
          */}
        </div>
      );
    }
    return content;
  }

}

SearchResultsTable.propTypes = {
  // from content
  intl: PropTypes.object,
  // from parent
  title: PropTypes.string,
  whichMedia: PropTypes.array,
  handleToggleAndSelectMedia: PropTypes.func,
};

export default
  injectIntl(
    SearchResultsTable
  );

