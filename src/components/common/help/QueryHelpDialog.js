import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import messages from '../../../resources/messages';

const localMessages = {
  invitation: { id: 'help.query.invitation', defaultMessage: 'Learn about writing queries.' },
  title: { id: 'help.query.title', defaultMessage: 'Writing Media Cloud Queries' },
  content: { id: 'help.query.content', defaultMessage: `
<p>You can query Media Cloud with boolean searches, a lot like you might use Google.  Here are some examples:</p>
<ul>
<li><code>cheese AND blue</code> - using "AND" lets you look for sentences that include both the word "cheese" and the word "blue"</li>
<li><code>"blue cheese"</code> - putting a phrase in quotes lets you search for sentences that use the phrase "blue cheese"</li>
<li><code>cheese OR cheesy</code> - using "OR" searches for sentences that use either "cheese" or the word "cheesy"</li>
<li><code>chees*</code> - using an asterix searches for sentences that use any word that starts with "chees" - including "cheese", "cheesy", or others</li>
<li><code>cheese AND NOT blue</code> - using "NOT" lets you remove content you don't want; searching for sentences that use the word "cheese" but don't have the word "blue" in them</li>
<li><code>cheese AND (blue OR manchego OR goat OR cheddar)</code> - using parentheses lets you author more complex queries; searching here for sentences that have the word "cheese" and at least one other word describing what type it is</li>
<li><code>queso AND language:es</code> - using the "language:" keyword lets you narrow in on a language; here searching for sentences that use the word "queso" and have been detected by our system as being written in Spanish</li>
</ul>
<p><a href="https://mediacloud.org/s/query-guide-rev1.pdf" target=_blank>Read our guide to creating queries to learn more</a>.</p>
  ` },
};

class QueryHelpDialog extends React.Component {
  state = {
    open: false,
  };
  handleOpen = (evt) => {
    this.setState({ open: true });
    evt.preventDefault();
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <FlatButton
        label={formatMessage(messages.ok)}
        primary
        onClick={this.handleClose}
      />,
    ];
    return (
      <span className="query-help-dialog">
        <a href="#help" onClick={this.handleOpen}><FormattedMessage {...localMessages.invitation} /></a>
        <Dialog
          title={formatMessage(localMessages.title)}
          actions={dialogActions}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <FormattedHTMLMessage {...localMessages.content} />
        </Dialog>
      </span>
    );
  }
}

QueryHelpDialog.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryHelpDialog
  );
