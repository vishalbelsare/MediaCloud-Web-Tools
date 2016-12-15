import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createSource } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import SourceForm from './form/SourceForm';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New Source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New Source' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new source' },
};

const CreateSourceContainer = (props) => {
  const { handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
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
          buttonLabel={formatMessage(localMessages.addButton)}
          onSave={handleSave}
        />
      </Grid>
    </div>
  );
};

CreateSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      url: values.url,
      name: values.name,
      notes: values.notes,
      collections: values.collections ? values.collections.map(s => s.id) : [],
    };
    // try to save it
    dispatch(createSource(infoToSave))
      .then((results) => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/sources/${results.media_id}`));
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateSourceContainer
    ),
  );
