import * as React from 'react';
import { Checkbox, Dropdown, Icon, Shimmer, Stack, TextField, TooltipHost } from '@fluentui/react';
import { LookupDropdown } from '../../controls/LookupDropdown';
import { PeoplePickerFormControl } from '../../controls/PeoplePicker';
import { useDropdownOption, useFormStore, useInput, useInputInitialized } from '../store';
import { WEBPART_CTX } from '../../CesDhlCreAppStateFormWebPart';
import styles from '../../styles/CesDhlCreAppStateForm.module.scss';
import { Field, FieldType } from '../../helpers/CommonTypes';
import * as _ from 'lodash';

export const CustomLabel = (props: { label: string; required?: boolean; description?: string }): JSX.Element => {
	return (
		<Stack horizontal style={{ alignItems: 'center', gap: 4 }}>
			<span style={{ fontWeight: '600' }}>{props.label}</span>
			{props.required && <span style={{ fontWeight: 700, color: 'red' }}>*</span>}
			{props.description && (
				<TooltipHost content={props.description}>
					<Icon style={{ color: 'rgb(97, 178, 216)', cursor: 'pointer', display: 'flex' }} iconName='Info' />
				</TooltipHost>
			)}
		</Stack>
	);
};

type FieldProps = {
	field: Field;
};
export const GeneralField = (props: FieldProps): JSX.Element => {
	const { field } = props;
	const ctx = React.useContext(WEBPART_CTX);
	const inputInitialized = useInputInitialized();
	const setInputs = useFormStore((store) => store.setInputs);
	const setInputsMultiple = useFormStore((store) => store.setInputsMultiple);
	const input = useInput(field?.id);
	const options = useDropdownOption(field?.id);

	const generalOnChange = ( _: any, newValues: any): void => {
		// on ProjectType change
		if (field.id === 'projectType') {
			setInputsMultiple(
				{ internalName: 'Purchase_x0020_Price', property: 'hidden', value: newValues?.key !== 'Purchase' },
				{
					internalName: 'Sales_x0020_Price',
					property: 'hidden',
					value: newValues?.key !== 'Sale' && newValues?.key !== 'Sale & Leaseback' && newValues?.key !== 'Heritable Land Sale',
				},
				{
					internalName: 'property_address',
					property: 'hidden',
					value: newValues?.key !== 'Purchase' && newValues?.key !== 'Sale' && newValues?.key !== 'Sale & Leaseback' && newValues?.key !== 'Heritable Land Sale',
				},
				{
					internalName: 'BackToBack',
					property: 'hidden',
					value: newValues?.key === 'Purchase' || newValues?.key === 'Sale' || newValues?.key === 'Sale & Leaseback' || newValues?.key === 'Heritable Land Sale',
				}
			);
		}
		setInputs(field.id, 'value', newValues);
	};

	if (!field || !input || input.hidden) return null;

	if (!inputInitialized) return <Shimmer />;

	// console.log('66X', field.id, field.required);

	const fieldDescription = ctx.statementApprovalsListFields.find((f) => f.InternalName === field.id)?.Description;
	const sharedProps = {
		onRenderLabel: (props: any) => <CustomLabel label={props.label} description={fieldDescription} required={field.required} />,
		onChange: generalOnChange,
		required: field.required,
		label: field.label,
		readOnly: field.readOnly,
		placeholder: field.placeHolder,
	};

	switch (field.type) {
		case FieldType.Checkbox:
			return <Checkbox {...sharedProps} checked={input.value} />;
		case FieldType.LookupDropdown:
			return <LookupDropdown {...sharedProps} view={field.filterView} lookupListId={field.lookupList} selectedKey={input.value?.key} />;
		case FieldType.TextField:
			return <TextField {...sharedProps} className={field.readOnly && styles.readOnlyTextField} value={input.value} />;
		case FieldType.Note:
			return <TextField {...sharedProps} className={field.readOnly && styles.readOnlyTextField} multiline={true}  style={{ resize: 'vertical'}} value={input.value} />;
		case FieldType.Dropdown: {
			return <Dropdown {...sharedProps} options={options} selectedKey={input.value?.key} />;
		}
		case FieldType.PeoplePicker: {
			return (
				<PeoplePickerFormControl
					{...sharedProps}
					readOnly={!ctx.hasEditPermission}
					context={ctx.context}
					defaultSelectedUsers={(Array.isArray(input.value) && input.value?.map((person: any) => person?.secondaryText)) || []}
					description={fieldDescription}
					displaySelected={(Array.isArray(input.value) && input.value?.map((person: any) => person.text)) || []}
					onChange={(_id, values) => setInputs(field.id, 'value', values)}
				/>
			);
		}
	}
};

const propsAreEqual = (prev: FieldProps, next: FieldProps): boolean => {
	return _.isEqual(prev, next);
};
export const GeneralFieldMemo = React.memo(GeneralField, propsAreEqual);
