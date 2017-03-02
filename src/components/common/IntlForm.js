import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';

/**
 * Helpful compositional wrapper for forms that want to use Material-UI, react-intl and redux-form.
 * This exposes render methods that you can use with redux-form's <Field> tag.  Pass in message objects
 * instead of strings for anything you want localized (error messages, hint text, etc.).
 */
function composeIntlForm(Component) {
  class IntlFormForm extends React.Component {

    intlIfObject = (value) => {
      if (typeof value === 'object') {
        return <FormattedMessage {...value} />;
      }
      return value;
    };

    intlCustomProps = (customProps) => {
      const intlCustom = Object.assign({}, customProps);
      ['label', 'floatingLabelText', 'hintText', 'errorText', 'disabled'].forEach((prop) => {
        if ((prop in customProps)) {
          intlCustom[prop] = this.intlIfObject(customProps[prop]);
        }
      });
      return intlCustom;
    };

    renderTextField = ({ input, name, meta: { touched, error }, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <TextField
          name={name}
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          {...input}
          {...intlCustom}
        />
      );
    };

    renderCheckbox = ({ input, name, label, disabled }) => (
      <Checkbox
        name={name}
        label={this.intlIfObject(label)}
        checked={input.value === true}
        onCheck={input.onChange}
        disabled={this.intlIfObject(disabled)}
      />
    );

    renderSelectField = ({ input, name, meta: { touched, error }, children, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <SelectField
          name={name}
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          {...input}
          onChange={(event, index, value) => input.onChange(value)}
          {...intlCustom}
        >
          {children}
        </SelectField>
      );
    }

    renderAutoComplete = ({ input, meta: { touched, error }, onNewRequest: onNewRequestFunc, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <AutoComplete
          {...input}
          errorText={touched && (error ? this.intlIfObject(error) : null)}
          onNewRequest={(currentValue) => {
            input.onChange(intlCustom.dataSourceConfig ? currentValue[intlCustom.dataSourceConfig.value] : currentValue);
            if (onNewRequestFunc && typeof onNewRequestFunc === 'function') {
              onNewRequestFunc(currentValue);
            }
          }}
          {...intlCustom}
          filter={AutoComplete.fuzzyFilter}
        />
      );
    }

    renderDatePickerInline = ({ input, name, type, ...custom }) => {
      const intlCustom = this.intlCustomProps(custom);
      return (
        <DatePicker
          {...input}
          value={new Date(input.value)}
          onChange={(event, value) => input.onChange(value)}
          name={name}
          {...intlCustom}
          container={type}
          mode="landscape"
          hintText={intlCustom.hintText}
        />
      );
    }

    render() {
      const helpers = {
        renderTextField: this.renderTextField,
        renderCheckbox: this.renderCheckbox,
        renderSelectField: this.renderSelectField,
        renderAutoComplete: this.renderAutoComplete,
        renderDatePickerInline: this.renderDatePickerInline,
      };
      return (
        <Component {...this.props} {...helpers} />
      );
    }

  }

  IntlFormForm.propTypes = {
    intl: React.PropTypes.object.isRequired,
  };

  return injectIntl(IntlFormForm);
}

export default composeIntlForm;
