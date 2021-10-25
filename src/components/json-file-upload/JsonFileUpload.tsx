import React from "react";
import { Language } from "@patternfly/react-code-editor";

import { FileUploadForm, FileUploadFormProps } from "./FileUploadForm";

export type JsonFileUploadProps = Omit<
  FileUploadFormProps,
  "onChange" | "language" | "extension"
> & {
  onChange: (obj: object) => void;
};

export const JsonFileUpload = ({ onChange, ...props }: JsonFileUploadProps) => {
  const handleChange = (value: string) => {
    if (value) {
      let obj = {};
      try {
        obj = JSON.parse(value as string);
      } catch (error) {
        console.warn("Invalid json, ignoring value using {}");
      }

      onChange(obj);
    }
  };

  return (
    <FileUploadForm
      {...props}
      language={Language.json}
      extension=".json"
      onChange={handleChange}
    />
  );
};
