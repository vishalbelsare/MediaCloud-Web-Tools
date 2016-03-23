import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

class ControversyListItem extends React.Component {
  getStyles() {
    const styles = {
      nameColumn: {
        width: "20%"
      }
    };
    return styles;
  }
  render(){
    const {controversy} = this.props;
    const styles = this.getStyles();
    return (
      <TableRow>
        <TableRowColumn styles={styles.nameColumn}>{controversy.name}</TableRowColumn>
        <TableRowColumn>{controversy.description}</TableRowColumn>
      </TableRow>
    );
  }
};

class ControversyList extends React.Component {
  renderItem(c) {
  }
  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Description</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.props.controversies.map( (controversy) => {
            return <ControversyListItem key={controversy.controversies_id} controversy={controversy} />
          })}
        </TableBody>
      </Table>);
  }
};

ControversyList.propTypes = {
  controversies: React.PropTypes.array.isRequired
};

export default ControversyList;