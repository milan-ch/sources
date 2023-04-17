import { Stack } from '@fluentui/react';
import * as React from 'react';
import { WEBPART_CTX } from '../../CesDhlCreAppStateFormWebPart';
import styles from '../../styles/CesDhlCreAppStateForm.module.scss';
import { PropsWithChildren } from 'react';
import { useInput } from '../store';

const FormHeader = (): JSX.Element => {
	const ctx = React.useContext(WEBPART_CTX);

	return (
		<Stack horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
			<div style={{ width: '33%', alignSelf: 'flex-start' }}>
				<img style={{ width: '33%' }} src={ctx.logoUrl} alt='' />
			</div>
			<h1 className={styles.title}>{ctx.title}</h1>
			<div style={{ width: '33%' }} />
		</Stack>
	);
};
type FormWrapperProps = {};
export const FormWrapper = (props: PropsWithChildren<FormWrapperProps>): JSX.Element => {
	const ctx = React.useContext(WEBPART_CTX);
	const titleFieldInput = useInput('Title');

	return (
		<div className={styles.cesDhlCreAppStateForm}>
			<div className={styles.container}>
				<div className={styles.content}>
					<FormHeader />
					<div className={styles.formContainer}>
						<div style={{ backgroundColor: `${ctx.separatorColor} !important` }} className={styles.separator} />
						<div style={{ fontWeight: '700', padding: 7, width: '100%', backgroundColor: '#e6e6e6' }}>
							{ctx.projectTitleHeaderText} : {titleFieldInput.value}
						</div>
						<div className={styles.componentColumn}>{props.children}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
