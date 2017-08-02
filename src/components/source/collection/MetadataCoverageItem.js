import React from 'react';
import { injectIntl } from 'react-intl';
import PieChart from '../../vis/PieChart';
import { getBrandDarkColor } from '../../../styles/colors';

const PIE_CHART_HEIGHT = 200;

const localMessages = {
  tooltipText: { id: 'collection.summary.metadatacoverage.tooltip', defaultMessage: '# Sources' },
};

const MetadataCoverageItem = (props) => {
  const { sources, metadataId, title, taggedText, notTaggedText } = props;
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
        data={[
          { name: taggedText, y: sourcesWithMetadata.length, color: getBrandDarkColor() },
          { name: notTaggedText, y: sourcesWithout, color: '#cccccc' },
        ]}
        height={PIE_CHART_HEIGHT}
        showDataLabels={false}
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
  taggedText: React.PropTypes.string,
  notTaggedText: React.PropTypes.string,
};

export default injectIntl(MetadataCoverageItem);
