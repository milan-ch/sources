import * as React from 'react';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { FormWrapper } from './general/FormWrapper';
import { useInputs } from './store';
import { getTabs } from '../helpers/CommonHelper';
import '@pnp/sp/fields';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import { useState } from 'react';
import { WEBPART_CTX } from '../CesDhlCreAppStateFormWebPart';
import { useSearchParams } from 'react-router-dom';
import { ApprovalTasksForm } from './approvalTasks/ApprovalTasksForm';
import { CesDhlCreAppStateFooter } from './CesDhlCreAppStateFooter';
  
export const CesDhlCreAppStateForm = (): JSX.Element => {
	const inputs = useInputs();
	const [searchParams] = useSearchParams();
	const ctx = React.useContext(WEBPART_CTX);
	const [pivotItems, setPivotItems] = useState([]);

	const [activeIndex, setActiveIndex] = useState(0);

	const handlePageClick = (item: any) => {
		const index = pivotItems.findIndex((i) => i.headerText === item.props.headerText);
		setActiveIndex(index);
	};

	const handleNextPageClick = () => {
		const nextIndex = activeIndex + 1;
		setActiveIndex(nextIndex);
	};

	const handlePreviousPageClick = () => {
		const prevIndex = activeIndex - 1;
		setActiveIndex(prevIndex);
	};
	
	React.useEffect(() => {
		const loadData = async (): Promise<void> => {
			const tabs = getTabs(inputs.projectType.value?.key);

			const id = searchParams.get("StatementId");

			if (id !== null) {
				ctx.statementId = parseInt(id);

				const currentUser = await ctx.sp.web.currentUser();
				
				const result = await ctx.sp.web.lists.getByTitle("Tasks").items.filter(`StatementLookupId eq '${ctx.statementId}' and AssignedToId eq '${currentUser.Id}' and Status eq 'Not Started'`)();

				if (result.length) {
					// eslint-disable-next-line require-atomic-updates
					ctx.approvalTaskId = Number(result[0].Id);
					tabs.push({
						headerText: "Approval Tasks",
						component: <ApprovalTasksForm />
					});
				}				
			}

			setPivotItems(tabs);
		}

		//eslint-disable-next-line	
		loadData();
	}, [inputs.projectType.value]);

	return (
		<FormWrapper>
			<Pivot 
				overflowBehavior='menu' 
				styles={{ root: { marginBottom: 10 } }}
				selectedKey={activeIndex.toString()}
				onLinkClick={(item) => handlePageClick(item)}
			>
				{pivotItems.map((item) => {
					return (
						<PivotItem key={item.headerText} headerButtonProps={{ disabled: item.disabled || false }} headerText={item.headerText}>
							{item.component || null}
						</PivotItem>
					);
				})}
			</Pivot>
			<CesDhlCreAppStateFooter
				onPreviousPage={handlePreviousPageClick} 
				onNextPage={handleNextPageClick} 
				showPreviousPageButton={activeIndex > 0} 
				showNextPageButton={activeIndex < (pivotItems.length - 1)} 
			/>
		</FormWrapper>
	);
};
