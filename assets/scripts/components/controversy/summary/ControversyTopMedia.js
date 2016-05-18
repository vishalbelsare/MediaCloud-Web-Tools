import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import messages from '../../../resources/messages';

class ControversyTopMedia extends React.Component {

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
      <Paper>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn><FormattedMessage {...messages.mediaName} /></TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.mediaType} /></TableHeaderColumn>
              <TableHeaderColumn><FormattedMessage {...messages.storyPlural} /></TableHeaderColumn>
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
            {media.map(m =>
              (<TableRow key={m.media_id}>
                <TableRowColumn><a href={m.url}>{m.name}</a></TableRowColumn>
                <TableRowColumn>{m.type}</TableRowColumn>
                <TableRowColumn>{m.story_count}</TableRowColumn>
                <TableRowColumn>{m.inlink_count}</TableRowColumn>
                <TableRowColumn>{m.outlink_count}</TableRowColumn>
                <TableRowColumn>{m.bitly_click_count}</TableRowColumn>
              </TableRow>)
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }

}

ControversyTopMedia.propTypes = {
  media: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
};

export default injectIntl(ControversyTopMedia);
