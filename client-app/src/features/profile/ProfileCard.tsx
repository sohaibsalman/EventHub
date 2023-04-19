import { observer } from "mobx-react-lite";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";

interface Props {
  profile: Profile;
}

function ProfileCard({ profile }: Props) {
  return (
    <Card as={Link} to={`/profile/${profile.username}`}>
      <Image src={profile.image || "/assets/user.png"} size="small" centered />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        20 followers
      </Card.Content>
    </Card>
  );
}

export default observer(ProfileCard);
