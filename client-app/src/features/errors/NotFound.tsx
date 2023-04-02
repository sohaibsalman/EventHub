import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

function NotFound() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        Oops - could not find the resource you requested!
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/activities">
          Go back to activities
        </Button>
      </Segment.Inline>
    </Segment>
  );
}

export default NotFound;
