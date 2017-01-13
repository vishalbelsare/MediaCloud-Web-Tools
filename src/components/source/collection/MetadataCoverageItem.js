import React from 'react';
import { injectIntl } from 'react-intl';
import PieChart from '../../vis/PieChart';

const localMessages = {
  set: { id: 'collection.summary.metadatacoverage.set', defaultMessage: 'Has Metadata tags' },
  notSet: { id: 'collection.summary.metadatacoverage.noset', defaultMessage: 'No Metadata tags' },
};

const MetadataCoverageItem = (props) => {
  const { sources, metadataId } = props;
  const { formatMessage } = props.intl;
  let content = null;
  let sourcesWithMetadata;

  if (sources) {
    sourcesWithMetadata = sources.map(tagarray => tagarray.media_source_tags)
    .map(tids => tids.filter(a => (a.tag_sets_id === metadataId))).filter(tf => tf.length > 0);

    const sourcesWithout = sources.length - sourcesWithMetadata.length;
    content = (
      <PieChart
        data={[
          { label: formatMessage(localMessages.set), count: sourcesWithMetadata.length, color: '#111111' },
          { label: formatMessage(localMessages.notSet), count: sourcesWithout, color: '#cccccc' },
        ]}
      />
    );
  }
  return (
    <div>
      {content}
    </div>
  );
};

MetadataCoverageItem.propTypes = {
  sources: React.PropTypes.array,
  metadataId: React.PropTypes.string,
  title: React.PropTypes.string,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MetadataCoverageItem);
