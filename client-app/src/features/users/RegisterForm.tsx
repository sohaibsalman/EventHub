import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";

import AppInputField from "../../app/common/form/AppInputField";
import { useStore } from "../../app/stores/store";
import ValidationErrors from "../errors/ValidationErrors";

function RegisterForm() {
  const { userStore } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Formik
      initialValues={{
        displayName: "",
        username: "",
        email: "",
        password: "",
        error: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
    >
      {({ handleSubmit, isSubmitting, errors, dirty, isValid }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            content="Register Form"
            color="teal"
            size="huge"
            textAlign="center"
          />
          <AppInputField name="displayName" placeholder="Your Name" />
          <AppInputField name="username" placeholder="Your Username" />
          <AppInputField name="email" placeholder="Your Email Address" />
          <AppInputField
            name="password"
            placeholder="Your Password"
            type="password"
          />
          <ErrorMessage
            name="error"
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            fluid
            positive
            type="submit"
            loading={isSubmitting}
            content="Register"
            disabled={isSubmitting || !isValid || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
}

export default observer(RegisterForm);
