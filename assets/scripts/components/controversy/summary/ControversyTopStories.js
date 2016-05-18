import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import messages from '../../../resources/messages';

class ControversyTopStories extends React.Component {

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { stories } = this.props;
    return (
      <Paper>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn><FormattedMessage {...messages.storyTitle} /></TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.media} /></TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.storyDate} /></TableHeaderColumn>
              <TableHeaderColumn><a href="#" onClick={ e => {e.preventDefault(); this.sortByInlinks();}}>
                <FormattedMessage {...messages.inlinks} /></a>
              </TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.outlinks} /></TableHeaderColumn>
              <TableHeaderColumn><a href="#" onClick={ e => {e.preventDefault(); this.sortBySocial();}}>
                <FormattedMessage {...messages.clicks} /></a>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map(story =>
              (<TableRow key={story.stories_id}>
                <TableRowColumn><a href={story.url}>{story.title}</a></TableRowColumn>
                // TODO: link this to the media source page with all selected filters applied
                <TableRowColumn><a href={story.media_url}>{story.media_name}</a></TableRowColumn>
                <TableRowColumn>{story.publish_date}</TableRowColumn>
                <TableRowColumn>{story.inlink_count}</TableRowColumn>
                <TableRowColumn>{story.outlink_count}</TableRowColumn>
                <TableRowColumn>{story.bitly_click_count}</TableRowColumn>
              </TableRow>)
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }

}

ControversyTopStories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
};

export default injectIntl(ControversyTopStories);
