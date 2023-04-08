import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";

function AppDateField(props: Partial<ReactDatePickerProps>) {
  const [field, meta, helpers] = useField(props.name!);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <ReactDatePicker
        {...field}
        {...props}
        selected={field.value && new Date(field.value)}
        onChange={(value) => helpers.setValue(value)}
      />
      {meta.touched && meta.error ? (
        <Label
          basic
          color="red"
          content={meta.error}
          className="mt-2"
          style={{ marginTop: 5 }}
        />
      ) : null}
    </Form.Field>
  );
}

export default AppDateField;
