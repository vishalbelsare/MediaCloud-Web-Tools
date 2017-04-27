import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import composeIntlForm from '../IntlForm';
import SourceSearchContainer from '../../source/controlbar/SourceSearchContainer';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const localMessages = {
  add: { id: 'source.add.collections.add', defaultMessage: 'You can search for Sources and Collections to add to this topic:' },
};

const renderCollectionSelector = ({ intro, allowRemoval, fields, meta: { error } }) => (
  <div>
    <Row>
      <Col sm={2}>
        <span className="label chip-label">{intro}</span>
      </Col>
      <Col lg={8}>
        {fields.map((name, index) => (
          <Field
            key={name}
            name={name}
            component={(info) => {
              const handleDelete = (allowRemoval || info.meta.dirty) ? () => fields.remove(index) : undefined;
              return (
                <SourceOrCollectionChip object={info.input.value} onDelete={handleDelete} />
              );
            }}
          />
        ))}
        {error && <div className="error">{error}</div>}
      </Col>
    </Row>
    <Row>
      <Col lg={12}>&nbsp;</Col>
    </Row>
    <Row>
      <Col lg={2}>
        <span className="label field-label"><FormattedMessage {...localMessages.add} /></span>
      </Col>
      <Col lg={8}>
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
  allowRemoval: React.PropTypes.bool,
};

const SourceCollectionsForm = (props) => {
  const { title, intro, initialValues, allowRemoval } = props;
  return (
    <div className="form-section source-collection-form">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2>{title}</h2>
        </Col>
      </Row>
      <FieldArray
        name="sourcesAndCollections"
        intro={intro}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
      />
    </div>
  );
};

SourceCollectionsForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  allowRemoval: React.PropTypes.bool,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        SourceCollectionsForm
      )
    )
  );
