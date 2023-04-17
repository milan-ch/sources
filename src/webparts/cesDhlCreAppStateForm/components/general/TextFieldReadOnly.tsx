import * as React from "react";
import { ITextFieldProps, TextField } from "@fluentui/react";

interface TextFieldReadOnlyProps extends ITextFieldProps {
  value?: string;
  label?: string;
}

export const TextFieldReadOnly = ({ value, label, ...props }: TextFieldReadOnlyProps): JSX.Element => {
  return (
    <TextField
      value={value}
      label={label}
      readOnly={true}
      {...props}
      styles={{
        fieldGroup: [
          {
            borderColor: "#605E5C",
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor: "#E6E6E6",
            selectors: {
              ":hover": {
                borderColor: "#605E5C !important",
                backgroundColor: "#E6E6E6 !important",
                borderWidth: "1px !important",
              },
            },
          },
        ],
      }}
    />
  );
};
