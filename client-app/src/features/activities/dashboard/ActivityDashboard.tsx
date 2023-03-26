import { Grid } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  editMode: boolean;
  onSelectActivity: (id: string) => void;
  onCancelActivity: () => void;
  onFormOpen: (id?: string) => void;
  onFormClose: () => void;
  onCreateOrEdit: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export default function ActivityDashboard({
  activities,
  selectedActivity,
  editMode,
  onSelectActivity,
  onCancelActivity,
  onFormOpen,
  onFormClose,
  onCreateOrEdit,
  onDeleteActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          activities={activities}
          onSelectActivity={onSelectActivity}
          onDeleteActivity={onDeleteActivity}
        />
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            onCancelActivity={onCancelActivity}
            onFormOpen={onFormOpen}
          />
        )}
        {editMode && (
          <ActivityForm
            onFormClose={onFormClose}
            activity={selectedActivity}
            onCreateOrEdit={onCreateOrEdit}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
