import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';

class InfluentialMedia extends React.Component {

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { media } = this.props;
    return (
      <table className="small">
        <tbody>
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
    );
  }

}

InfluentialMedia.propTypes = {
  media: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
};

export default injectIntl(InfluentialMedia);
