import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { FieldArray, Field, reduxForm } from 'redux-form';
import composeIntlForm from '../../../common/IntlForm';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import SourceSearchContainer from '../../controlbar/SourceSearchContainer';

const localMessages = {
  title: { id: 'source.add.collections.title', defaultMessage: 'Collections' },
  existing: { id: 'source.add.collections.existing', defaultMessage: 'This Source is in the following Collections:' },
  add: { id: 'source.add.collections.add', defaultMessage: 'Add this Source to an existing Collection:' },
};

const renderCollectionSelector = ({ fields, meta: { error } }) => (
  <div className="form-section source-collections-form">
    <Row>
      <Col sm={4} xs={12}>
        <span className="label chip-label"><FormattedMessage {...localMessages.existing} /></span>
      </Col>
      <Col sm={6} xs={12}>
        {fields.map((collection, index) =>
          <Field
            key={`c${index}`}
            name={collection}
            component={info => (
              <Chip className="chip" key={`chip${index}`} onRequestDelete={() => fields.remove(index)}>
                <Avatar size={32}><CollectionIcon height={15} /></Avatar>
                {info.input.value.name}
              </Chip>
            )}
          />
        )}
        {error && <li className="error">{error}</li>}
      </Col>
    </Row>
    <Row>
      <Col xs={12}>&nbsp;</Col>
    </Row>
    <Row>
      <Col sm={4} xs={12}>
        <span className="label field-label"><FormattedMessage {...localMessages.add} /></span>
      </Col>
      <Col sm={6} xs={12}>
        <SourceSearchContainer
          searchSources={false}
          searchStaticCollections={false}
          onCollectionSelected={item => fields.push(item)}
        />
      </Col>
    </Row>
  </div>
);
renderCollectionSelector.propTypes = {
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
};

const SourceCollectionsForm = () => (
  <div className="source-collection-form">
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
      </Col>
    </Row>
    <FieldArray name="collections" component={renderCollectionSelector} />
  </div>
);

SourceCollectionsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

const reduxFormConfig = {
  form: 'sourceForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SourceCollectionsForm
      )
    )
  );
