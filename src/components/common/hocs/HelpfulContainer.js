import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-flexbox-grid/lib';
import Dialog from '@material-ui/core/Dialog';
import messages from '../../../resources/messages';
import { HelpButton } from '../IconButton';

/**
 * Use this with the JS Composition pattern to make a Container that has a help button.
 * Clicking that button brings up a dialog with the title and text from the message key
 * that you specify.
 * `contentHTMLTextMsg` can be a intl message  or an array of intl message s.
 */
function withHelp(contentTitleMsg, contentHTMLTextMsg, showHelpSidebar) {
  return (ChildComponent) => {
    class HelpfulContainer extends React.Component {
      state = {
        open: false,
        titleMsg: contentTitleMsg,
        contentMsg: contentHTMLTextMsg,
      };
      setTitleMsg = (titleMsg) => {
        this.setState({ titleMsg });
      };
      setContentMsg = (contentMsg) => {
        this.setState({ contentMsg });
      };
      handleOpen = () => {
        this.setState({ open: true });
      };
      handleClose = () => {
        this.setState({ open: false });
      };
      render() {
        const { formatMessage } = this.props.intl;
        const dialogActions = [
          <Button
            variant="outlined"
            label={formatMessage(messages.ok)}
            primary
            onClick={this.handleClose}
          />,
        ];
        const helpButton = <HelpButton onClick={this.handleOpen} />;
        let content = null;
        if (this.state.contentMsg) {
          if (Array.isArray(this.state.contentMsg)) {
            content = this.state.contentMsg.map(msg => (msg ? <FormattedHTMLMessage key={msg.id} {...msg} /> : ''));
          } else {
            content = <FormattedHTMLMessage {...this.state.contentMsg} />;
          }
        }
        let displayContent;
        if (showHelpSidebar) {
          displayContent = (
            <Row>
              <Col lg={8}>
                <ChildComponent {...this.props} helpButton={helpButton} helpContent={content} />
              </Col>
              <Col lg={4}>
                <div className="helpful-content">
                  {content}
                </div>
              </Col>
            </Row>
          );
        } else {
          displayContent = (
            <ChildComponent
              {...this.props}
              helpButton={helpButton}
              helpContent={content}
              setHelpTitleMsg={this.setTitleMsg}
              setHelpContentMsg={this.setContentMsg}
            />
          );
        }
        const dialogTitle = (this.state.titleMsg) ? formatMessage(this.state.titleMsg) : '';
        return (
          <span className="helpful">
            {displayContent}
            <Dialog
              title={dialogTitle}
              actions={dialogActions}
              modal={false}
              className="app-dialog"
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              {content}
            </Dialog>
          </span>
        );
      }
    }

    HelpfulContainer.propTypes = {
      intl: PropTypes.object.isRequired,
    };

    return injectIntl(HelpfulContainer);
  };
}

export default withHelp;
