import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import CollectionList from './CollectionList';
import { fetchSourceCollectionList } from '../../actions/sourceActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

const localMessages = {
  collectionsListTitle: { id: 'sources.list.title', defaultMessage: 'List of Collections' },
};

class SourceCollectionListContainer extends React.Component {
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
    const title = formatMessage(localMessages.collectionsListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        const { sources } = this.props;
        content = <CollectionList sources={sources} />;
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

SourceCollectionListContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sources: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

SourceCollectionListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.allcollections.fetchStatus,
  sources: state.sources.allcollections.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => {
    dispatch(fetchSourceCollectionList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionListContainer));
