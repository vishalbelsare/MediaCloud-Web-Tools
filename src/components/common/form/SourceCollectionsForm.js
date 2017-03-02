import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import composeIntlForm from '../IntlForm';
import CollectionIcon from '../icons/CollectionIcon';
import SourceSearchContainer from '../../source/controlbar/SourceSearchContainer';

const localMessages = {
  add: { id: 'source.add.collections.add', defaultMessage: 'You can search for Sources and Collections to add to this topic:' },
};

const renderCollectionSelector = ({ intro, fields, meta: { error } }) => (
  <div>
    <Row>
      <Col sm={4} xs={12}>
        <span className="label chip-label">{intro}</span>
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
        {error && <div className="error">{error}</div>}
      </Col>
    </Row>
    <Row>
      <Col xs={12}>&nbsp;</Col>
    </Row>
    <Row>
      <Col sm={4} xs={6}>
        <span className="label field-label"><FormattedMessage {...localMessages.add} /></span>
      </Col>
      <Col sm={6} xs={6}>
        <SourceSearchContainer
          searchSources
          searchStaticCollections
          onCollectionSelected={item => fields.push(item)}
          onMediaSourceSelected={item => fields.push(item)}
        />
      </Col>
    </Row>
  </div>
);
renderCollectionSelector.propTypes = {
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  intro: React.PropTypes.string.isRequired,
};

const SourceCollectionsForm = (props) => {
  const { title, intro, initialValues } = props;
  return (
    <div className="form-section source-collection-form">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2>{title}</h2>
        </Col>
      </Row>
      <FieldArray name="sourcesAndCollections" intro={intro} component={renderCollectionSelector} initialValues={initialValues} />
    </div>
  );
};

SourceCollectionsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        SourceCollectionsForm
      )
    )
  );
