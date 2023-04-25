import { SyntheticEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";

import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
  profile: Profile;
}

function ProfilePhotos({ profile }: Props) {
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      uploading,
      setMain,
      loading,
      deletePhoto,
    },
  } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  const handlePhotoUpload = async (file: Blob) => {
    await uploadPhoto(file);
    setAddPhotoMode(false);
  };

  const handleSetMainPhoto = async (
    photo: Photo,
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(event.currentTarget.name);
    await setMain(photo);
  };

  const handleDeletePhoto = async (
    photo: Photo,
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(event.currentTarget.name);
    await deletePhoto(photo.id);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              onPhotoUpload={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        content="Main"
                        basic
                        name={"main" + photo.id}
                        color="green"
                        disabled={photo.isMain}
                        loading={loading && "main" + photo.id === target}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        icon="trash"
                        basic
                        color="red"
                        disabled={photo.isMain}
                        name={photo.id}
                        loading={loading && photo.id === target}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default observer(ProfilePhotos);
