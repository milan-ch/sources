import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useMemo, useState } from "react";
import { Stack, IconButton } from "@fluentui/react";
import styles from "../overview/Overview.module.scss";
import { DeleteModal } from "./DeleteModal";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";

const baseStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    outline: "none",
    paddingLeft: 10,
    transition: "border .24s ease-in-out",
    height: 27,
};

const focusedStyle = {
    borderColor: "#FFCC00",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

export const FileDropZone = (): JSX.Element => {
    const [files, setFiles] = useState<File[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [fileToDelete, setFileToDelete] = useState<File | null>(null);
    const ctx = React.useContext(WEBPART_CTX);

    //    const _onDropDocuments = async (selFiles) => {
    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
        onDrop: async (acceptedFiles: File[]) => {

            // const item: IItem = ctx.sp.web.lists.getByTitle("CRE Statement Approvals").items.getById(ctx.statementId);
            // await item.attachmentFiles.add(acceptedFiles[0].name, acceptedFiles[0]);            

            setFiles([...files, ...acceptedFiles]);
        },
    });    

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const handleDeleteFile = (file: File): void => {
        setFileToDelete(file);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirmed = (): void => {
        if (fileToDelete) {
            const filteredFiles = files.filter((f) => f !== fileToDelete);
            setFiles(filteredFiles);
            setFileToDelete(null);
            setDeleteModalVisible(false);
        }
    };

    const fileList = files.map((file) => {
        const fileName = file.name.length > 20 ? file.name.slice(0, 30) + "..." : file.name;
        return (
            <Stack horizontal key={file.name} verticalAlign="center">
                <Stack.Item grow>{fileName}</Stack.Item>
                {ctx.hasEditPermission && <IconButton
                    iconProps={{ iconName: "Delete" }}
                    title="Delete file"
                    ariaLabel="Delete file"
                    onClick={() => handleDeleteFile(file)}
                    className={styles.noHover}
                />
                }
            </Stack>
        );
    });

    return (
        <>
            <section className="container">
                {ctx.hasEditPermission && <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>Add Attachment</p>
                </div>
                }
                {fileList.length > 0 ? <Stack>{fileList}</Stack> : null}
            </section>
            {ctx.hasEditPermission && fileToDelete && (
                <DeleteModal
                    isOpen={deleteModalVisible}
                    onDismiss={() => setDeleteModalVisible(false)}
                    onDelete={handleDeleteConfirmed}
                />
            )}
        </>
    );
};
