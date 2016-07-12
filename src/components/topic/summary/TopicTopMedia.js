import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
import messages from '../../../resources/messages';

class TopicTopMedia extends React.Component {

  getStyles() {
    const styles = {
      scrollWrapper: {
        overflow: 'scroll',
        height: 300,
        display: 'block',
      },
    };
    return styles;
  }

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { media, topicId } = this.props;
    const styles = this.getStyles();
    return (
      <div>
        <table className="small">
          <tbody style={styles.scrollWrapper}>
            <tr>
              <th><FormattedMessage {...messages.mediaName} /></th>
              <th><FormattedMessage {...messages.mediaType} /></th>
              <th><FormattedMessage {...messages.storyPlural} /></th>
              <th><a href="#" onClick={ e => {e.preventDefault(); this.sortByInlinks();}}>
                <FormattedMessage {...messages.inlinks} /></a>
              </th>
              <th><FormattedMessage {...messages.outlinks} /></th>
              <th><a href="#" onClick={ e => {e.preventDefault(); this.sortBySocial();}}>
                <FormattedMessage {...messages.clicks} /></a>
              </th>
            </tr>
            {media.map((m, idx) =>
              (<tr key={m.media_id} className={ (idx % 2 === 0) ? 'even' : 'odd'}>
                <td><a href={m.url}>{m.name}</a></td>
                <td>{m.type}</td>
                <td>{m.story_count}</td>
                <td>{m.inlink_count}</td>
                <td>{m.outlink_count}</td>
                <td>{m.bitly_click_count}</td>
              </tr>)
            )}
          </tbody>
        </table>
        <LinkWithFilters to={`/topics/${topicId}/media`} style={styles.name}>
          <FormattedMessage {...messages.details} />
        </LinkWithFilters>
      </div>
    );
  }

}

TopicTopMedia.propTypes = {
  media: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
};

export default injectIntl(TopicTopMedia);
