import { Button } from "semantic-ui-react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";

import AppInputField from "../../app/common/form/AppInputField";
import AppTextArea from "../../app/common/form/AppTextArea";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
  setEditProfileMode: (flag: boolean) => void;
}

function ProfileEditForm({ profile, setEditProfileMode }: Props) {
  const {
    profileStore: { updateProfile },
  } = useStore();

  const initialValues: Partial<Profile> = {
    displayName: profile.displayName,
    bio: profile.bio ?? "",
  };

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Display Name is required"),
  });

  const handleFormSubmit = async (values: Partial<Profile>) => {
    await updateProfile(values);
    setEditProfileMode(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(value) => handleFormSubmit(value)}
    >
      {({ isSubmitting, isValid, dirty, handleSubmit }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <AppInputField placeholder="Display Name" name="displayName" />
          <AppTextArea placeholder="Bio" name="bio" rows={10} />
          <Button
            positive
            type="submit"
            floated="right"
            content="Update Profile"
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
}

export default observer(ProfileEditForm);
