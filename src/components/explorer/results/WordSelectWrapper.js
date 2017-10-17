import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

/**
 * Simple wrapper so we can style all the button the same.  Use this instead of
 * material-ui's RaisedButton.
 * @see http://stackoverflow.com/questions/39458150/is-it-possible-to-add-a-custom-hover-color-to-raised-buttons
 */

const LEFT = 0;
const RIGHT = 1;

class WordSelectWrapper extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { selectComparativeWords, leftQuery, rightQuery } = this.props;
    if (nextProps.leftQuery !== leftQuery ||
      nextProps.rightQuery !== rightQuery) {
      selectComparativeWords(nextProps.leftQuery, LEFT);
      selectComparativeWords(nextProps.rightQuery, RIGHT);
    }
  }
  selectThisQuery = (targetIndex, value) => {
    // get value and which menu (left or right) and then run comparison
    // get query out of queries at queries[targetIndex] and pass "q" to fetch
    // store choice of selectField
    const { selectComparativeWords, queries } = this.props;
    let queryObj = {};
    queryObj = queries[value];
    if (targetIndex === LEFT) {
      selectComparativeWords(queryObj, LEFT);
    } else {
      selectComparativeWords(queryObj, RIGHT);
    }
  }
  render() {
    const { queries, leftQuery, rightQuery } = this.props;
    const menuItems = queries.map((q, idx) =>
      <MenuItem key={idx} value={idx} primaryText={q.label} />
    );
    let content = null;
    if (leftQuery !== null) {
      content = (
        <Row>
          <Col>
            <SelectField
              floatingLabelText="Left Column"
              value={leftQuery.index || queries[0].index}
              onChange={(...args) => this.selectThisQuery(LEFT, args[2])}
            >
              {menuItems}
            </SelectField>
          </Col>
          <Col>
            <SelectField
              floatingLabelText="Right Column"
              value={rightQuery.index || queries[1].index}
              onChange={(...args) => this.selectThisQuery(RIGHT, args[2])}
            >
              {menuItems}
            </SelectField>
          </Col>
        </Row>
      );
    }
    return content;
  }

}

WordSelectWrapper.propTypes = {
  // from parent
  title: PropTypes.string,
  queries: PropTypes.array,
  selectComparativeWords: PropTypes.func,
  leftQuery: PropTypes.object,
  rightQuery: PropTypes.object,
};

export default WordSelectWrapper;
