import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import AppInputField from "../../../app/common/form/AppInputField";
import AppTextArea from "../../../app/common/form/AppTextArea";
import AppSelectField from "../../../app/common/form/AppSelectField";
import { categoryOptions } from "../../../app/common/options/categoryOptions";

function ActivityForm() {
  const { activityStore } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    createActivity,
    updateActivity,
    loading,
    loadingInitial,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    city: "",
    date: "",
    description: "",
    venue: "",
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Activity title is required"),
    description: Yup.string().required("Activity description is required"),
    category: Yup.string().required("Activity category is required"),
    city: Yup.string().required("Activity city is required"),
    date: Yup.string().required("Activity date is required"),
    venue: Yup.string().required("Activity venue is required"),
  });

  // const handleInputChange = (
  //   event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // };

  // const handleSubmit = async () => {
  //   if (!activity.id) {
  //     activity.id = uuid();
  //     await createActivity(activity);
  //   } else {
  //     await updateActivity(activity);
  //   }
  //   navigate(`/activities/${activity.id}`);
  // };

  if (loadingInitial) return <LoadingComponent content="Loading details..." />;

  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        initialValues={activity}
        validationSchema={validationSchema}
        onSubmit={(value) => console.log(value)}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} autoComplete="off" className="ui form">
            <AppInputField placeholder="Title" name="title" />
            <AppTextArea
              placeholder="Description"
              name="description"
              rows={3}
            />
            <AppSelectField
              placeholder="Category"
              name="category"
              options={categoryOptions}
            />
            <AppInputField placeholder="Date" name="date" />
            <AppInputField placeholder="City" name="city" />
            <AppInputField placeholder="Venue" name="venue" />
            <Button
              floated="right"
              content="Submit"
              positive
              type="submit"
              loading={loading}
            />
            <Button
              floated="right"
              content="Cancel"
              type="button"
              as={Link}
              to="/activities"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}

export default observer(ActivityForm);
