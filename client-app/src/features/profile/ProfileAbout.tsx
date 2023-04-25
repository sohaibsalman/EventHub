import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Grid, Header, Tab } from "semantic-ui-react";

import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

interface Props {
  profile: Profile;
}

function ProfileAbout({ profile }: Props) {
  const [editProfileMode, setEditProfileMode] = useState(false);

  const {
    profileStore: { isCurrentUser },
  } = useStore();
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            content={`About ${profile.displayName}`}
            icon="user"
            floated="left"
          />
          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editProfileMode ? (
            <ProfileEditForm
              profile={profile}
              setEditProfileMode={setEditProfileMode}
            />
          ) : (
            <p>
              <span style={{ whiteSpace: "pre-wrap" }}>{profile.bio}</span>
            </p>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default observer(ProfileAbout);
