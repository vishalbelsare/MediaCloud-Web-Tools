import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateSource } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Edit Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Update Source' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We updated this source' },
};

const EditSourceContainer = (props) => {
  const { handleSave, source } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const intialValues = {
    ...source,
    collections: source.media_source_tags
      .map(t => ({ ...t, name: t.label }))
      .filter(t => (t.tag_sets_id === 5) && (t.show_on_media === 1)),
  };
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <SourceForm
          initialValues={intialValues}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.addButton)}
        />
      </Grid>
    </div>
  );
};

EditSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  // form state
  sourceId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  source: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sourceDetails.fetchStatus,
  source: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    // try to save it
    dispatch(updateSource(values))
      .then(() => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/sources/${ownProps.params.sourceId}`));
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      EditSourceContainer
    ),
  );
