import { Button, Container, Menu } from "semantic-ui-react";

interface Props {
  onFormOpen: () => void;
}

export default function Navbar({ onFormOpen }: Props) {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          EventHub
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={onFormOpen} />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
