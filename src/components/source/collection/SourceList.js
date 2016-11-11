import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import SourceTable from '../SourceTable';

const localMessages = {
  title: { id: 'collection.details.sources.title', defaultMessage: 'Sources' },
  intro: { id: 'collection.details.sources.intro',
    defaultMessage: 'This collection includes {count, plural,\n =0 {no media sources} \n =1 {one media source} \n other {# media sources}\n}.',
  },
};

class SourceList extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/sources.csv`;
    window.location = url;
  }

  render() {
    const { sources } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard className="source-list">
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <p>
          <FormattedMessage
            {...localMessages.intro}
            values={{ count: sources.length }}
          />
        </p>
        <SourceTable sources={sources} />
      </DataCard>
    );
  }

}

SourceList.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  sources: React.PropTypes.array.isRequired,
  collectionId: React.PropTypes.number.isRequired,
};

export default
  injectIntl(
    SourceList
  );
