import * as React from "react";
import { DatePicker, IDatePickerProps } from "@fluentui/react";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";
import { formatDate } from "../../helpers/CommonHelper";
import * as moment from "moment";
import { CustomTextField } from "./CustomTextField";

interface CustomDatePickerFieldProps extends IDatePickerProps {
  val: string;
  label?: string;
}

export const CustomDatePickerField = ({ value, label, ...props }: CustomDatePickerFieldProps): JSX.Element => {
  const ctx = React.useContext(WEBPART_CTX);

  return (
    <>
      {ctx.hasEditPermission && <DatePicker value={props.val?.length ? moment(props.val).toDate() : null} formatDate={formatDate} label={label} {...props} />}
      {!ctx.hasEditPermission && <CustomTextField value={props.val?.length ? formatDate(moment(props.val).toDate()) : null} label={label} />}
    </>
  );
};
