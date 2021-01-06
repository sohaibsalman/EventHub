import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';

export interface IProps {
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDetails: React.FC<IProps> = ({
  setEditMode,
  setSelectedActivity,
}) => {
  const activityStore = React.useContext(ActivityStore);
  const { selectedActivity: activity } = activityStore;
  return (
    <Card fluid>
      <Image
        src={`/assets/img/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => setEditMode(true)}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => setSelectedActivity(null)}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
