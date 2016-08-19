import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import FocalSetSummary from './FocalSetSummary';

const localMessages = {
  title: { id: 'focus.techniquePicker.title', defaultMessage: 'Pick a Focal Set' },
  about: { id: 'focus.techniquePicker.about',
    defaultMessage: 'Your Focus must belong to a Focal Set. All the Foci within a Focal Set share the same Focal Technique. Our tools lets you compare Foci with a Focal Set, but they don\'t let you easily compare Foci in different Focal Sets.' },
  newFocalSetName: { id: 'focus.techniquePicker.new.name', defaultMessage: 'Create a New Focal Set' },
  newFocalSetDescription: { id: 'focus.techniquePicker.new.description', defaultMessage: 'Pick this if you want to make a new Focal Set for this Focus.  Any Foci you add to it will be based on keyword searches.' },
};

export const NEW_FOCAL_SET_PLACEHOLDER_ID = -1;

class FocalSetDefinitionSelector extends React.Component {

  handleClick = (focalSet) => {
    const { onSelected } = this.props;
    onSelected(focalSet);
  }

  handleSelectNew = () => {
    this.handleSelect(NEW_FOCAL_SET_PLACEHOLDER_ID);
  }

  handleSelect = (id) => {
    const { onSelected } = this.props;
    onSelected({ focal_set_definitions_id: id });
  }

  render() {
    const { focalSetDefinitions, selected } = this.props;
    const { formatMessage } = this.props.intl;
    const selectedId = (selected === null) ? null : selected.focal_set_definitions_id;
    return (
      <div>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <h3><FormattedMessage {...localMessages.title} /></h3>
            <p><FormattedMessage {...localMessages.about} /></p>
          </Col>
        </Row>
        <Row>
          {focalSetDefinitions.map(focalSetDef =>
            <FocalSetSummary
              selected={(selectedId === focalSetDef.focal_set_definitions_id)}
              key={focalSetDef.focal_set_definitions_id}
              focalSet={focalSetDef}
              onClick={this.handleClick}
            />
          )}
          <FocalSetSummary
            key={NEW_FOCAL_SET_PLACEHOLDER_ID}
            selected={(selectedId === NEW_FOCAL_SET_PLACEHOLDER_ID)}
            focalSet={{
              name: formatMessage(localMessages.newFocalSetName),
              description: formatMessage(localMessages.newFocalSetDescription),
            }}
            onClick={this.handleSelectNew}
          />
        </Row>
      </div>
    );
  }

}

FocalSetDefinitionSelector.propTypes = {
  focalSetDefinitions: React.PropTypes.array.isRequired,
  selected: React.PropTypes.object,
  onSelected: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    FocalSetDefinitionSelector
  );
