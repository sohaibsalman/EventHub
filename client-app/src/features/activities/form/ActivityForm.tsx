import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";

function ActivityForm() {
  const { activityStore } = useStore();
  const { selectedActivity, createActivity, updateActivity, loading } =
    activityStore;

  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    city: "",
    date: "",
    description: "",
    venue: "",
  };

  const [activity, setActivity] = useState(initialState);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    activity.id ? updateActivity(activity) : createActivity(activity);
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          name="description"
          value={activity.description}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Date"
          name="date"
          type="date"
          value={activity.date}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={handleInputChange}
        />
        <Button
          floated="right"
          content="Submit"
          positive
          type="submit"
          loading={loading}
        />
        <Button floated="right" content="Cancel" type="button" />
      </Form>
    </Segment>
  );
}

export default observer(ActivityForm);
