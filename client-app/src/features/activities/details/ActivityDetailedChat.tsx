import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, FieldProps } from "formik";
import { observer } from "mobx-react-lite";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";
import * as Yup from "yup";

import { useStore } from "../../../app/stores/store";
import { formatDistanceToNow } from "date-fns";

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
  }, [activityId, clearComments, createHubConnection]);

  const validationSchema = Yup.object({
    body: Yup.string().required(),
  });

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
        <Formik
          onSubmit={(values, { resetForm }) =>
            addComment(values).then(() => resetForm())
          }
          initialValues={{ body: "" }}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form" onSubmit={handleSubmit}>
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                      rows={2}
                      {...props.field}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ whitespace: "pre-wrap" }}>
                  {comment.body}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
});
