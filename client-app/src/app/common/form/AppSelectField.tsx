import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  label?: string;
  options: any;
}

function AppSelectField(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        options={props.options}
        value={field.value}
        onChange={(e, d) => helpers.setValue(d.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder}
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

export default AppSelectField;
