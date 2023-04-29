import { useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Segment, Header, Comment, Form, Button } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";
import AppTextArea from "../../../app/common/form/AppTextArea";

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const {
    commentStore: { createHubConnection, clearComments, comments, addComment },
  } = useStore();

  useEffect(() => {
    createHubConnection(activityId);

    return () => {
      clearComments();
    };
  }, [activityId, clearComments]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Comment.Group>
          {comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{comment.createdAt!}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
          <Formik
            onSubmit={(values, { resetForm }) =>
              addComment(values).then(() => resetForm())
            }
            initialValues={{ body: "" }}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form" onSubmit={handleSubmit}>
                <AppTextArea placeholder="Add comment" name="body" rows={3} />
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  type="submit"
                  floated="right"
                />
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
