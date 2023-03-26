import { Grid } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  editMode: boolean;
  submitting: boolean;
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
  submitting,
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
          submitting={submitting}
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
            submitting={submitting}
            onCreateOrEdit={onCreateOrEdit}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
