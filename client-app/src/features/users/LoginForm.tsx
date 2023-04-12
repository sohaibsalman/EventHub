import { ErrorMessage, Form, Formik } from "formik";
import { Button, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import AppInputField from "../../app/common/form/AppInputField";
import { useStore } from "../../app/stores/store";

function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .catch((error) => setErrors({ error: "Invalid email or password" }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <AppInputField name="email" placeholder="Your Email Address" />
          <AppInputField
            name="password"
            placeholder="Your Password"
            type="password"
          />
          <ErrorMessage
            name="error"
            render={() => (
              <Label
                style={{ marginBottom: 10 }}
                basic
                color="red"
                content={errors.error}
              />
            )}
          />
          <Button
            fluid
            positive
            type="submit"
            loading={isSubmitting}
            content="Login"
          />
        </Form>
      )}
    </Formik>
  );
}

export default observer(LoginForm);
