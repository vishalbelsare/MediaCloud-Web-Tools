import React from 'react';
import { injectIntl } from 'react-intl';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const ControversyTopStories = (props) => {
  const { stories } = props;
  return (
    <Paper>
      <Table selectable={false}>
        <TableHeader adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Title</TableHeaderColumn>
            <TableHeaderColumn>Media Source</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn>Inlinks</TableHeaderColumn>
            <TableHeaderColumn>Outlinks</TableHeaderColumn>
            <TableHeaderColumn>Clicks</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map(story =>
            (<TableRow key={story.stories_id}>
              <TableRowColumn><a href={story.url}>{story.title}</a></TableRowColumn>
              // TODO: link this to the media source page with all selected filters applied
              <TableRowColumn><a href={story.media_url}>{story.media_name}</a></TableRowColumn>
              <TableRowColumn>{story.publish_date}</TableRowColumn>
              <TableRowColumn>{story.inlinks}</TableRowColumn>
              <TableRowColumn>{story.outlinks}</TableRowColumn>
              <TableRowColumn>{story.bitly_click_count}</TableRowColumn>
            </TableRow>)
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

ControversyTopStories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversyTopStories);
