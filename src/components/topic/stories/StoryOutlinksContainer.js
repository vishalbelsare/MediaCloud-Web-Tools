import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryOutlinks } from '../../../actions/topicActions';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import messages from '../../../resources/messages';
import Paper from 'material-ui/Paper';
import StoryTable from '../StoryTable';

class StoryOutlinksContainer extends React.Component {
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
    const { outlinkedStories } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...messages.outlinks} /></h2>
            <StoryTable stories={outlinkedStories} />
          </div>
        </Paper>
      </div>
    );
  }
}

StoryOutlinksContainer.propTypes = {
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
  outlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.story.outlinks.list,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (timespanId) => {
    dispatch(fetchStoryOutlinks(ownProps.topicId, timespanId, ownProps.storiesId)); // fetch the info we need
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
        StoryOutlinksContainer
      )
    )
  );
