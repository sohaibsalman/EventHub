import { observer } from "mobx-react-lite";
import { Reveal, Button } from "semantic-ui-react";

import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";

interface Props {
  profile: Profile;
}

function FollowButton({ profile }: Props) {
  const {
    userStore,
    profileStore: { loading, updateFollowing },
  } = useStore();

  if (userStore.user?.username === profile.username) return null;

  const handleFollowing = async (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    await updateFollowing(username, !profile.following);
  };

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not Following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={(e) => handleFollowing(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
}

export default observer(FollowButton);
