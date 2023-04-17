import * as React from "react";
import { ITextFieldProps, TextField } from "@fluentui/react";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";

interface CustomTextFieldProps extends ITextFieldProps {
  value?: string;
  label?: string;
}

export const CustomTextField = ({ value, label, ...props }: CustomTextFieldProps): JSX.Element => {
  const ctx = React.useContext(WEBPART_CTX);

  return (
    <>
      {ctx.hasEditPermission && <TextField value={value} label={label} {...props} />}
      {!ctx.hasEditPermission &&
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
      }
    </>
  );
};
