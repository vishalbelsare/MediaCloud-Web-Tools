import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import LoadingSpinner from '../../common/LoadingSpinner';
import TopicInfo from './TopicInfo';
import StoriesSummaryContainer from './StoriesSummaryContainer';
import MediaSummaryContainer from './MediaSummaryContainer';
import WordsSummaryContainer from './WordsSummaryContainer';
import SentenceCountSummaryContainer from './SentenceCountSummaryContainer';
import messages from '../../../resources/messages';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class TopicSummaryContainer extends React.Component {
  getStyles() {
    const styles = {
      root: {
      },
      row: {
        marginBottom: 15,
      },
    };
    return styles;
  }
  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }
  render() {
    const { filters, topicId, topicInfo } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    const styles = this.getStyles();
    let content = <div />;
    let subContent = <div />;
    if (this.filtersAreSet()) {
      subContent = (
        <Grid>
          <Row style={styles.row}>
            <Col lg={6} md={12} sm={12}>
              <SentenceCountSummaryContainer topicId={topicId} filters={filters} />
            </Col>
            <Col lg={6} md={12} sm={12}>
              <WordsSummaryContainer topicId={topicId} filters={filters} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col lg={12} md={12} sm={12}>
              <StoriesSummaryContainer topicId={topicId} filters={filters} />
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col lg={6} md={12} sm={12}>
              <MediaSummaryContainer topicId={topicId} filters={filters} />
            </Col>
            <Col lg={6} md={12} sm={12}>
              <TopicInfo topic={topicInfo} />
            </Col>
            <Col lg={6} md={12} sm={12} />
          </Row>
        </Grid>
      );
    } else {
      subContent = <LoadingSpinner />;
    }
    content = (
      <div>
        {subContent}
      </div>
    );
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <div>
          {content}
        </div>
      </div>
    );
  }
}

TopicSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});

export default injectIntl(connect(
  mapStateToProps,
  null
)(TopicSummaryContainer));
