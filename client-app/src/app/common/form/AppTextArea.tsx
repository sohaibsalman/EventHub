import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  label?: string;
  rows: number;
}

function AppInputField(props: Props) {
  const [field, meta] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <textarea {...field} {...props} rows={props.rows} />
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

export default AppInputField;
