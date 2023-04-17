import { IDropdownOption, Dropdown, IDropdownProps } from '@fluentui/react';
import * as React from 'react';
import { WEBPART_CTX } from '../CesDhlCreAppStateFormWebPart';

import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/views';

type LookupDropdownProps = Omit<IDropdownProps, 'options'> & {
	lookupListId: string;
	view?: string;
	onChange?: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => void;
	selectedKey?: string | number;
};
type ListItem = {
	Id: string;
	Title: string;
};
export const LookupDropdown = (props: LookupDropdownProps) => {
	const ctx = React.useContext(WEBPART_CTX);

	const [options, setOptions] = React.useState([]);
	const [optionsLoading, setOptionsLoading] = React.useState(true);
	React.useEffect(() => {
		const fetchOptions = async () => {
			try {
				if (!props.lookupListId) {
					setOptionsLoading(false);
					return;
				}

				if (props.view) {
					const result = await ctx.sp.web.lists
						.getById(props.lookupListId)
						.items.filter("Active eq '1'")
						.getPaged();
					const items: ListItem[] = result.results;
					const itemsOptions: IDropdownOption[] = items.map(item => ({ key: item?.Id, text: item?.Title }));
					setOptions(itemsOptions);
				} else {
					const items: ListItem[] = await ctx.sp.web.lists.getById(props.lookupListId).items();
					const itemsOptions: IDropdownOption[] = items.map(item => ({ key: item?.Id, text: item?.Title }));
					setOptions(itemsOptions);
				}
			} finally {
				setOptionsLoading(false);
			}
		};
		//eslint-disable-next-line
		fetchOptions();
	}, [props.lookupListId, ctx.sp]);
	return <Dropdown options={options} {...props} placeholder="Please select a value..." />;
};
