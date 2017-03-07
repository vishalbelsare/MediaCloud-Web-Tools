import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateSource, fetchSourceDetails } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';
import { isCollectionTagSet, TAG_SET_PUBLICATION_COUNTRY } from '../../../lib/tagUtil';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import Permissioned from '../../common/Permissioned';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Modify this Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save Changes' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your changes to this source' },
};

const EditSourceContainer = (props) => {
  const { handleSave, source } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  const pubCountry = source.media_source_tags.find(t => t.tag_sets_id === TAG_SET_PUBLICATION_COUNTRY);
  const intialValues = {
    ...source,
    // if user cannot edit media, disabled=true
    collections: source.media_source_tags
      .map(t => ({ ...t, name: t.label }))
      .filter(t => (isCollectionTagSet(t.tag_sets_id) && (t.show_on_media === 1))),
    publicationCountry: pubCountry ? pubCountry.tags_id : undefined,
  };
  return (
    <div className="edit-source">
      <Title render={titleHandler} />
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
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
      </Permissioned>
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
  fetchStatus: state.sources.sources.selected.sourceDetails.fetchStatus,
  source: state.sources.sources.selected.sourceDetails,
  // user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    // try to save it
    dispatch(updateSource(values))
      .then((result) => {
        if (result.success === 1) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          dispatch(fetchSourceDetails(ownProps.params.sourceId))
            .then(() =>
              dispatch(push(`/sources/${ownProps.params.sourceId}`))
            );
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      EditSourceContainer
    ),
  );
