import * as React from 'react';
import { Stack, TextField } from '@fluentui/react';
import { PeoplePicker } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { CustomLabel } from '../components/general/Field';
import {ICustomPeoplePickerProps} from "./ControlTypes";

export const PeoplePickerFormControl: React.FunctionComponent<ICustomPeoplePickerProps> = (props: ICustomPeoplePickerProps) => {
	return (
		<Stack>
			<CustomLabel label={props.label} description={props.description} required={props.required} />
			{props.readOnly ? (
				<TextField
					readOnly={true}
					value={props.displaySelected ? props.displaySelected.join(', ') : ''}
					styles={{ fieldGroup: { border: props.readOnly ? '1px solid #605e5c !important' : '1px solid #c8c6c4 !important' } }}
					disabled={props.readOnly}
				/>
			) : (
				<div>
					<PeoplePicker
						context={props.context}
						personSelectionLimit={props.limit || 1000}
						required={props.required}
						defaultSelectedUsers={props.defaultSelectedUsers}
						onChange={(items: any[]) => props.onChange('', items)}
						principalTypes={props.principalTypes}
						resolveDelay={200}
						errorMessage={props.errorMessage}
					/>
				</div>
			)}
		</Stack>
	);
};
