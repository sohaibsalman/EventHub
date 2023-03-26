import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  submitting: boolean;
  onSelectActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
}

export default function ActivityList({
  activities,
  submitting,
  onSelectActivity,
  onDeleteActivity,
}: Props) {
  const [target, setTarget] = useState("");

  const handleDelete = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setTarget(event.currentTarget.name);
    onDeleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activities.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  onClick={() => onSelectActivity(activity.id)}
                />
                <Button
                  floated="right"
                  content="Delete"
                  color="red"
                  name={activity.id}
                  loading={submitting && target === activity.id}
                  onClick={(e) => handleDelete(e, activity.id)}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}
