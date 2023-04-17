
//Interface for object returned by PeoplePicker
import {PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker";

export type IPeoplePickerValue = {
	id?: string;
	imageInitials?: string;
	imageUrl?: string;
	loginName?: string;
	optionalText?: string;
	secondaryText?: string;
	tertiaryText?: string;
	text?: string;
};

export type ICustomPeoplePickerProps = {
	label: string;
	required?: boolean;
	readOnly?: boolean;
	context: any;
	defaultSelectedUsers?: string[];
	displaySelected?: any[];
	errorMessage?: string;
	filterGroupName?: string;
	description?: string;
	limit?: number;
	onChange: (id: string, values: IPeoplePickerValue[]) => void;
	principalTypes?: PrincipalType[];
};