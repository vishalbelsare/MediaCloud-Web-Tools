import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryInlinks } from '../../../actions/topicActions';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import messages from '../../../resources/messages';
import Paper from 'material-ui/Paper';
import StoryTable from '../StoryTable';

class StoryInlinksContainer extends React.Component {
  getStyles() {
    const styles = {
      root: {
      },
      contentWrapper: {
        padding: 10,
      },
      actionButtons: {
        float: 'right',
      },
    };
    return styles;
  }
  render() {
    const { inlinkedStories } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...messages.inlinks} /></h2>
            <StoryTable stories={inlinkedStories} />
          </div>
        </Paper>
      </div>
    );
  }
}

StoryInlinksContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  storiesId: React.PropTypes.string.isRequired,
  timespanId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  inlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.story.inlinks.list,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (timespanId) => {
    dispatch(fetchStoryInlinks(ownProps.topicId, timespanId, ownProps.storiesId)); // fetch the info we need
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.timespanId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncWidget(
        StoryInlinksContainer
      )
    )
  );
