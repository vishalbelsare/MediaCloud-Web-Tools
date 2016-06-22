import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import SourceList from './SourceList';
import SourceSearchContainer from './SourceSearchContainer';
import { fetchSourceList } from '../../actions/sourceActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

const localMessages = {
  sourcesListTitle: { id: 'sources.list.title', defaultMessage: 'List of Sources' },
};

class SourceListContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { fetchStatus, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(localMessages.sourcesListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { sources } = this.props;
        content = <SourceList sources={sources} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Grid>
        <SourceSearchContainer />
          <Row>
            <Col lg={12}>
              <h2>{title}</h2>
              {content}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

SourceListContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sources: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

SourceListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.allSources.fetchStatus,
  sources: state.sources.allSources.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => {
    dispatch(fetchSourceList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceListContainer));
