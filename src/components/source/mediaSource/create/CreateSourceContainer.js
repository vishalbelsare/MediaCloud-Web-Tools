import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import SourceAddMetaContainer from './SourceAddMetaContainer';
import composeAsyncContainer from '../../../common/AsyncContainer';
import CollectionList from '../CollectionList';
import { fetchCollectionList, createSource, addThisSourceToCollection } from '../../../../actions/sourceActions';
import AppButton from '../../../common/AppButton';


const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New source' },
  sourceName: { id: 'source.add.name', defaultMessage: 'Name of Source' },
  sourceDescription: { id: 'source.add.description', defaultMessage: 'URL' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New source' },
  notes: { id: 'source.add.static', defaultMessage: 'Editor`s Notes' },
  collections: { id: 'source.add.collections', defaultMessage: 'Current collections' },

};

const CreateSourceContainer = (props) => {
  const { handleSubmit, handleSave, collections } = props;
  const { renderTextField } = props;
  const { formatMessage } = props.intl;
  const titleHandler = formatMessage(localMessages.mainTitle);
  const buttonLabel = formatMessage(localMessages.addButton);
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <form name="sourceCreateForm" onSubmit={handleSubmit(handleSave.bind(this))}>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.sourceName} /></h3>
            </Col>
            <Col lg={5} md={5} sm={12}>
              <Field
                name="sourceName"
                component={renderTextField}
                fullWidth
                floatingLabelText={localMessages.sourceName}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.sourceDescription} /></h3>
            </Col>
            <Col lg={5} md={5} sm={12}>
              <Field
                name="sourceDescription"
                component={renderTextField}
                fullWidth
                floatingLabelText={localMessages.sourceDescription}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5} md={5} sm={5}>
              <h3><FormattedMessage {...localMessages.notes} /></h3>
            </Col>
            <Col lg={5} md={5} sm={12}>
              <Field
                name="notes"
                component={renderTextField}
                fullWidth
                floatingLabelText={localMessages.notes}
              />
            </Col>
          </Row>
          <SourceAddMetaContainer onSave={handleSave} />
          <CollectionList title="Collections" collections={collections} />
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            label={buttonLabel}
            primary
          />
        </form>
      </Grid>
    </div>
  );
};

CreateSourceContainer.propTypes = {
  asyncFetch: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  handleSave: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  extHandleClick: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  collections: React.PropTypes.array,
  // from state
};

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
  return errors;
}

const reduxFormConfig = {
  form: 'sourceCreateForm', // make sure this matches the sub-components and other wizard steps
  validate,
};


const mapStateToProps = state => ({
  fetchStatus: state.sources.allCollections.fetchStatus,
  collections: state.sources.allCollections.array,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchCollectionList());
    // dispatch(fetchSourceMetadata);
  },
  handleSave: (values) => {
    const newVals = Object.assign({}, values, {
      sourceObj: [{ name: values.sourceName, url: values.sourceUrl }] });
    dispatch(createSource(newVals));
   // .then(() => dispatch(createSource(ownProps.sourceId)));
  },
  extHandleClick: (item) => {
    dispatch(addThisSourceToCollection(item));
  },
});

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          composeAsyncContainer(
            CreateSourceContainer
          ),
        ),
      ),
    ),
  );
