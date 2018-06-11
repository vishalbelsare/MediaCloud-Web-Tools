import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { VIEW_1K } from '../../lib/topicFilterUtil';

/**
 * Wrap any component that wants to display an EditableWordCloud. This passes
 * a `fetchData` helper to the child component,.
 */
const composeTopicEditableWordCloudContainer = (ChildComponent) => {
  class TopicEditableWordCloudContainer extends React.Component {
    state = {
      sampleSize: VIEW_1K,
    };

    // shouldComponentUpdate = () => false;

    setSampleSize = (nextSize) => {
      const { fetchData } = this.props;
      this.setState({ sampleSize: nextSize });
      fetchData(nextSize);
    }
    render() {
      const { sampleSize } = this.state;
      return (
        <div className="csv-download-notifier">
          <ChildComponent
            {...this.props}
            initSampleSize={sampleSize}
            onViewSampleSizeClick={ss => this.setSampleSize(ss)}
          />
        </div>
      );
    }
  }
  TopicEditableWordCloudContainer.propTypes = {
    // from compositional chain
    fetchData: PropTypes.func.isRequired,
  };

  return connect()(
    injectIntl(
      TopicEditableWordCloudContainer
    )
  );
};

export default composeTopicEditableWordCloudContainer;
