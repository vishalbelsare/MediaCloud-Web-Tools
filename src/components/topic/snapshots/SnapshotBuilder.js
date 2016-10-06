import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
};

const SnapshotBuilder = props => (
  <div className="snapshot-builder">
    <Title render={props.intl.formatMessage(localMessages.title)} />
    {props.children}
  </div>
);

SnapshotBuilder.propTypes = {
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
};

export default
  injectIntl(
    SnapshotBuilder
  );
