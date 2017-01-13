import React from 'react';
import { injectIntl } from 'react-intl';
import PieChart from '../../vis/PieChart';
import { getBrandDarkColor, getBrandLightColor } from '../../../styles/colors';

const localMessages = {
  set: { id: 'collection.summary.metadatacoverage.set', defaultMessage: 'Has Metadata tags' },
  notSet: { id: 'collection.summary.metadatacoverage.noset', defaultMessage: 'No Metadata tags' },
<<<<<<< HEAD
  tooltipText: { id: 'collection.summary.metadatacoverage.tooltip', defaultMessage: '# Sources:' },
=======
>>>>>>> origin/master
};

const MetadataCoverageItem = (props) => {
  const { sources, metadataId, title } = props;
  const { formatMessage } = props.intl;
  let content = null;
  let sourcesWithMetadata;

  if (sources) {
    sourcesWithMetadata = sources.map(tagarray => tagarray.media_source_tags)
    .map(tids => tids.filter(a => (a.tag_sets_id === metadataId))).filter(tf => tf.length > 0);

    const sourcesWithout = sources.length - sourcesWithMetadata.length;
    content = (
      <PieChart
        title={title}
        tooltipText={formatMessage(localMessages.tooltipText)}
        colors={[getBrandDarkColor(), getBrandLightColor()]}
        data={[
          { name: formatMessage(localMessages.set), y: sourcesWithMetadata.length },
          { name: formatMessage(localMessages.notSet), y: sourcesWithout },
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
  metadataId: React.PropTypes.number,
  title: React.PropTypes.string,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MetadataCoverageItem);
