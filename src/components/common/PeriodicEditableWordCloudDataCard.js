import React from 'react';
import { injectIntl } from 'react-intl';
import EditableWordCloudDataCard from './EditableWordCloudDataCard';
import composePeriodicContent from './PeriodicContent';
import { calculateTimePeriods } from '../../lib/dateUtil';

const PeriodicEditableWordCloudDataCard = props => (
  <EditableWordCloudDataCard
    words={props.words}
    subtitleContent={props.timePeriodControls}
    downloadUrl={`${props.downloadUrl}?q=${calculateTimePeriods(props.selectedTimePeriod)}`}
    targetURL={props.targetURL}
    onViewModeClick={props.onViewModeClick}
    domId={props.domId}
    width={520}
    title={props.title}
    helpButton={props.helpButton}
  />
);

PeriodicEditableWordCloudDataCard.propTypes = {
  // from parent
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
  itemId: React.PropTypes.string,
  downloadUrl: React.PropTypes.string,
  explore: React.PropTypes.object,
  download: React.PropTypes.func,
  helpButton: React.PropTypes.node,
  targetURL: React.PropTypes.string,
  handleTimePeriodClick: React.PropTypes.func.isRequired,
  selectedTimePeriod: React.PropTypes.string.isRequired,
    // from dispatch
  onViewModeClick: React.PropTypes.func.isRequired,
  domId: React.PropTypes.string.isRequired,
  // from compositional chain
  timePeriodControls: React.PropTypes.node.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    composePeriodicContent(
      PeriodicEditableWordCloudDataCard
    )
  );
