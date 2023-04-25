import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";

import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { WidgetFile } from "../../models/widgetFile";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  loading: boolean;
  onPhotoUpload: (file: Blob) => void;
}

function PhotoUploadWidget({ loading, onPhotoUpload }: Props) {
  const [files, setFiles] = useState<WidgetFile[]>();
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => onPhotoUpload(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files?.forEach((file: WidgetFile) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add Photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize Image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            imagePreview={files[0].preview}
            setCropper={setCropper}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - Preview & Upload" />
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <Button.Group widths={2}>
              <Button
                onClick={onCrop}
                positive
                icon="check"
                loading={loading}
              />
              <Button
                onClick={() => setFiles([])}
                icon="close"
                disabled={loading}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}

export default PhotoUploadWidget;
