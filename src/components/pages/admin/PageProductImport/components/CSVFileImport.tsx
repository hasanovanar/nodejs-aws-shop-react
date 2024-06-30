import React from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      console.log("Requesting presigned URL from", url);

      // Get the presigned URL
      const response = await axios(url, {
        method: "GET",
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      const presignedUrl = response.data;

      console.log("Presigned URL:", presignedUrl);

      console.log("File to upload: ", file.name);

      console.log("Uploading to: ", presignedUrl);

      console.log("File details:", file);

      // Upload the file to S3 using the presigned URL
      const result = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "text/csv",
        },
      });

      console.log("File uploaded response:", result);
      if (!result.ok) {
        console.error("Failed to upload:", await result.text());
      }
      setFile(undefined); // Clear the file input after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
