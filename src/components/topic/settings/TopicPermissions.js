import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

const localMessages = {
  title: { id: 'topic.permissions.title', defaultMessage: 'Permissions' },
  intro: { id: 'topic.permissions.intro', defaultMessage: 'You can control who is allowed to see, and who is allowed to edit, this Topic. Enter another user\'s email in the field below, set whethe they can read or edit the topic, and then click add.' },
  emailFieldHint: { id: 'topic.permissions.email.hint', defaultMessage: 'Enter someone\'s email' },
  read: { id: 'topic.permissions.read', defaultMessage: 'Read' },
  write: { id: 'topic.permissions.write', defaultMessage: 'Edit' },
  addUser: { id: 'topic.permissions.addUser', defaultMessage: 'Add This Person' },
};

const TopicPermissions = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div className="topic-acl">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2><FormattedMessage {...localMessages.title} /></h2>
          <p><FormattedMessage {...localMessages.intro} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={5} md={5} sm={12}>
          <TextField fullWidth hintText={formatMessage(localMessages.emailFieldHint)} />
        </Col>
        <Col lg={2} md={2} sm={12}>
          <Checkbox
            label={formatMessage(localMessages.read)}
            defaultChecked
          />
        </Col>
        <Col lg={2} md={2} sm={12}>
          <Checkbox label={formatMessage(localMessages.write)} />
        </Col>
        <Col lg={2} md={2} sm={12}>
          <RaisedButton label={formatMessage(localMessages.addUser)} primary />
        </Col>
      </Row>
    </div>
  );
};

TopicPermissions.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicPermissions
  );
