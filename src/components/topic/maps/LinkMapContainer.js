import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LinkMapForm from './LinkMapForm';
import { selectTopic, filterBySnapshot, filterByFocus, filterByTimespan } from '../../../actions/topicActions';
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  title: { id: 'topic.maps.link.title', defaultMessage: 'Link Map' },
  intro: { id: 'topic.maps.link.title', defaultMessage: 'We can generate a network graph showing how the media sources linked to each other.' },
  fetchButton: { id: 'topic.maps.button', defaultMessage: 'Download network map' },
};

class LinkMapContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }

  render() {
    const { handleFetchMapData } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    const initialValues = { color_field: 'media_type', num_media: 500, include_weights: false };
    return (
      <Grid>
        <Title render={titleHandler} />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <LinkMapForm
          initialValues={initialValues}
          onFetch={handleFetchMapData}
          buttonLabel={formatMessage(localMessages.fetchButton)}
        />

      </Grid>
    );
  }

}

LinkMapContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  // from state
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from parent
  handleFetchMapData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleFetchMapData: (values) => {
    // try to save it
    const params = generateParamStr({ ...ownProps.location.query, ...values });

    const url = `/api/topics/${ownProps.params.topicId}/map-files/fetchCustomMap?${params}`;
    window.location = url;
  },
  fetchData: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    // select any filters that are there
    const query = ownProps.location.query;
    if (ownProps.location.query.snapshotId) {
      dispatch(filterBySnapshot(query.snapshotId));
    }
    if (ownProps.location.query.focusId) {
      dispatch(filterByFocus(query.focusId));
    }
    if (ownProps.location.query.timespanId) {
      dispatch(filterByTimespan(query.timespanId));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      LinkMapContainer
    )
  );
