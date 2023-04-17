import * as React from "react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DefaultButton, Dropdown, IDropdownOption, Label, Stack } from "@fluentui/react";
import styles from "./Overview.module.scss";
import { FormSection, TextSection } from "../statementSetup/StatementSetup";
import { MarketOverviewGeneral } from "./marketOverview/MarketOverviewGeneral";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";
import { useDropzone } from "react-dropzone";
import { useDataStore } from "../tStore";
import { MultilineVerticalTextField } from "../general/MultilineVerticalTextField";
import { CustomTextField } from "../general/CustomTextField";
import { ScrollablePane } from "../general/ScrollablePane";
import { IMarketOverviewItem, IOverviewCreAppState } from "./OverviewTypes";
import { AcceptStyle, BaseStyle, FocusedStyle, RejectStyle } from "./OverviewStyles";

export const OverviewCreAppStateForm = (): JSX.Element => {
    const [photoFiles, setPhotoFiles] = useState([]);
    const [locationFiles, setLocationFiles] = useState([]);
    const [characterCount, setCharacterCount] = React.useState("");
    const maxLength = 2000;
    const remainingChars = maxLength - characterCount.length;
    const isMaxedOut = remainingChars <= 0;

    const [marketOverviewItems2, setMarketOverviewItems] = useState<IMarketOverviewItem[]>([]);
    const [formData, setFormData] = React.useState<IOverviewCreAppState>({
        //   projectContextSplit: ProjectContextSplit,
        marketOverViewRentHigh: null,
        marketOverViewRentLow: null,
        marketOverviewItems: null
    });

    const inputChange = (key: keyof IOverviewCreAppState, value: string | boolean | number): void => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [key]: value
            };
        });
    };

    const handleEvent =
        (propName: keyof IOverviewCreAppState): ((event: React.FormEvent<HTMLInputElement>) => void) =>
            (_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
                inputChange(propName, newValue);
            };

    // const inputChangeProjectSplit = (index: number, key: keyof IProjectContextSplit, value: string | boolean | number): void => {
    //     setFormData(prevState => {
    //         const updatedArray = [...prevState.projectContextSplit];
    //         updatedArray[index] = {
    //             ...updatedArray[index],
    //             [key]: value
    //         };
    //         return {
    //             ...prevState,
    //             projectSplit: updatedArray
    //         };
    //     });
    // };

    // const handleEventPCSplit =
    //     (propName: keyof IProjectContextSplit): ((event: React.FormEvent<HTMLInputElement>) => void) =>
    //         (_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
    //             inputChangeProjectSplit(propName, newValue);
    //         };

    // const [projectContextSplit, setProjectContextSplit] = useState<IProjectContextSplit>();

    React.useEffect(() => {
        const form: IOverviewCreAppState = useDataStore.getState().forms.Overview;
        setFormData(form);
        //setProjectContextSplit(form.projectContextSplit);
        setMarketOverviewItems(form.marketOverviewItems);

        if (form.projectContext)
            setCharacterCount(form.projectContext);
    }, []);

    React.useEffect(() => {
        console.log(formData);

        const data: IOverviewCreAppState = {
            //   projectContextSplit: projectContextSplit,
            projectContext: formData.projectContext,
            marketOverViewRentHigh: formData.marketOverViewRentHigh,
            marketOverViewRentLow: formData.marketOverViewRentLow,
            marketOverview: formData.marketOverview,
            marketOverviewSource: formData.marketOverviewSource,
            CRERole: formData.CRERole,
            marketOverviewItems: []
        };

        useDataStore.getState().setOverview(data);
    }, [formData, marketOverviewItems2])

    const {
        getRootProps: getPhotoRootProps,
        getInputProps: getPhotoInputProps,
        isFocused: isPhotoFocused,
        isDragAccept: isPhotoDragAccept,
        isDragReject: isPhotoDragReject,
    } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            setPhotoFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    const {
        getRootProps: getLocationRootProps,
        getInputProps: getLocationInputProps,
        isFocused: isLocationFocused,
        isDragAccept: isLocationDragAccept,
        isDragReject: isLocationDragReject,
    } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            setLocationFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => locationFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    const locationFile = locationFiles.map((file) => (
        <div key={file.name} style={{ textAlign: "center" }}>
            <img
                alt={"locationFile"}
                style={{ height: 150 }}
                src={file.preview}
                // Revoke data uri after image is loaded
                onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                }}
            />
        </div>
    ));

    const photoFile = photoFiles.map((file) => (
        <div key={file.name} style={{ textAlign: "center" }}>
            <img
                alt={"photoFile"}
                style={{ height: 150 }}
                src={file.preview}
                // Revoke data uri after image is loaded
                onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                }}
            />
        </div>
    ));

    const removeLocationFile = (file: React.MouseEvent<HTMLButtonElement>): void => {
        const newFiles = [...locationFiles];
        newFiles.splice(newFiles.indexOf(file), 1);
        setLocationFiles(newFiles);
    };

    const removePhotoFile = (file: React.MouseEvent<HTMLButtonElement>): void => {
        const newFiles = [...photoFiles];
        newFiles.splice(newFiles.indexOf(file), 1);
        setPhotoFiles(newFiles);
    };

    const photoStyle = useMemo(
        () => ({
            ...BaseStyle,
            ...(isPhotoFocused ? FocusedStyle : {}),
            ...(isPhotoDragAccept ? AcceptStyle : {}),
            ...(isPhotoDragReject ? RejectStyle : {}),
        }),
        [isPhotoFocused, isPhotoDragAccept, isPhotoDragReject]
    );

    const locationStyle = useMemo(
        () => ({
            ...BaseStyle,
            ...(isLocationFocused ? FocusedStyle : {}),
            ...(isLocationDragAccept ? AcceptStyle : {}),
            ...(isLocationDragReject ? RejectStyle : {}),
        }),
        [isLocationFocused, isLocationDragAccept, isLocationDragReject]
    );

    const ctx = React.useContext(WEBPART_CTX);

    const [visibility, setVisibility] = React.useState(false);
    const [reason, setReason] = React.useState(null);

    React.useEffect(() => {
        // skryvame pokud neni ani sale ani purchase
        setVisibility(ctx.selectedProjectType === "Sale" ||
            ctx.selectedProjectType === "Purchase" ||
            ctx.selectedProjectType === "Heritable Land Sale" ||
            ctx.selectedProjectType === "Sale & Leaseback");

        if (ctx.selectedProjectType === "Sale" ||
            ctx.selectedProjectType === "Heritable Land Sale" ||
            ctx.selectedProjectType === "Sale & Leaseback") {
            setReason("Sale");
        } else if (ctx.selectedProjectType === "Purchase") {
            setReason("Purchase");
        } else {
            setReason(null);
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCharacterCount(e.target.value);
        inputChange('projectContext', e.target.value);
    };

    const [errorMessage, setErrorMessage] = React.useState("");

    const validationHighLowValue = (): void => {
        if (Number(formData.marketOverViewRentLow) > Number(formData.marketOverViewRentHigh)) {
            setErrorMessage("Low value should be smaller than high value");
        } else {
            setErrorMessage("");
        }
    };

    const options: IDropdownOption[] = [
        { key: "Full Control", text: "Full Control" },
        { key: "Support", text: "Support" },
        {
            key: "Remote confirmation of real estate data & BCA approval",
            text: "Remote confirmation of real estate data & BCA approval",
        },
    ];

    return (
        <>
            <Stack>
                <Dropdown
                    selectedKey={formData.CRERole || "Full Control"}
                    label="Real Estate Role"
                    options={options}
                    onChange={(e, option) => { inputChange("CRERole", option?.key?.toString()) }}
                    style={{ width: "50%" }}
                />
                {/* Project Description - skryto pokud je reason Sale, Purchase */}
                <div hidden={reason !== null}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Label>Project Description</Label>
                        <Label style={{ fontWeight: 400, color: isMaxedOut ? "red" : "inherit" }}>
                            Characters left: {remainingChars}
                        </Label>
                    </div>
                    <MultilineVerticalTextField value={formData.projectContext} maxLength={maxLength} onChange={handleChange} rows={5} />
                </div>
            </Stack>
            <Stack style={{ marginTop: 10 }}>
                {/*  Description of location */}
                <div hidden={reason === null}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <Label>Description of Location</Label>
                    </div>
                    {/* <MultilineVerticalTextField value={projectContextSplit?.locationDesc} onChange={inputChange("locationDesc")} rows={5} /> */}
                    <MultilineVerticalTextField rows={5} />
                </div>

                {/* Description of Property */}
                <div hidden={reason === null}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <Label>Description of Property</Label>
                    </div>
                    {/* <MultilineVerticalTextField value={formData.projectContextSplit?.propertyDesc} onChange={handleEventPCSplit("propertyDesc")} rows={5} /> */}
                    <MultilineVerticalTextField rows={5} />
                </div>

                {/* Current / Planned Use */}
                <div hidden={reason === null}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <Label>Current / Planned Use</Label>
                    </div>
                    {/* <MultilineVerticalTextField value={formData.projectContextSplit?.propertyUse} onChange={handleEventPCSplit("propertyUse")} rows={5} /> */}
                    <MultilineVerticalTextField rows={5} />
                </div>
                {/* Reason for sale */}
                <div hidden={reason !== "Sale"}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <Label>Reason for sale</Label>
                    </div>
                    {/* <MultilineVerticalTextField value={formData.projectContextSplit?.PurchaseSaleReasons} onChange={handleEventPCSplit("PurchaseSaleReasons")} rows={5} /> */}
                    <MultilineVerticalTextField rows={5} />
                </div>

                {/* Reason for purchase */}
                <div hidden={reason !== "Purchase"}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <Label>Reason for purchase</Label>
                    </div>
                    {/* <MultilineVerticalTextField value={formData.projectContextSplit?.PurchaseSaleReasons} onChange={handleEventPCSplit("PurchaseSaleReasons")} rows={5} /> */}
                    <MultilineVerticalTextField rows={5} />
                </div>

                {/* Market Overview */}
                <div hidden={visibility}>
                    <Stack style={{ marginBottom: 8 }}>
                        <FormSection text={"Market Overview"} />
                        <TextSection
                            text={"Where available please provide a minimum of 3 comparable lease locations:"} />
                    </Stack>

                    <ScrollablePane>
                        <Stack className={styles.headerMarketOverview}>
                            <Label>Location</Label>
                            <Label>Lease</Label>
                            <Label>Space (m2)</Label>
                            <Label>Rent</Label>
                            <Label>Incentive</Label>
                        </Stack>
                        <Stack className={styles.subHeaderMarketOverview} horizontal={true}>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Address
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Start Date
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Term (mths)
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Office
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Warehouse
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Total
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            >
                                Rent (€/m²/mth)
                            </Label>
                            <Label
                                style={{
                                    fontWeight: 400,
                                    textAlign: "center",
                                    alignSelf: "center",
                                }}
                            />
                        </Stack>
                        <MarketOverviewGeneral marketOverItems={setMarketOverviewItems} />
                    </ScrollablePane>
                </div>

                {/* Market rent */}
                <div hidden={visibility}>
                    <Stack style={{ paddingTop: 10 }}>
                        <TextSection text={"Please indicate the market range and provide a description:"} />
                    </Stack>
                    <div style={{ paddingTop: 10 }} />
                    <Stack>
                        <Label>Market Rent (€/m²/mth)</Label>
                        <Stack className={styles.marketRentLayout}>
                            <Label>Low</Label>
                            <Label>High</Label>
                        </Stack>
                        <Stack className={styles.marketRentLayout}>
                            <CustomTextField value={formData.marketOverViewRentLow} onChange={handleEvent("marketOverViewRentLow")} onBlur={validationHighLowValue} />
                            <CustomTextField value={formData.marketOverViewRentHigh} onChange={handleEvent("marketOverViewRentHigh")} onBlur={validationHighLowValue} />
                        </Stack>
                        {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
                        <Stack>
                            <Label>Source</Label>
                            <MultilineVerticalTextField value={formData.marketOverviewSource} onChange={handleEvent("marketOverviewSource")} rows={2} />
                            <Label>Description</Label>
                            <MultilineVerticalTextField value={formData.marketOverview} onChange={handleEvent("marketOverview")} rows={3} />
                        </Stack>
                    </Stack>
                </div>

                {/* Site Photo, Site Location */}
                <div style={{ paddingTop: 10 }} />
                <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                    <Stack style={{ width: "50%" }}>
                        <FormSection text={"Site Photo"} />
                        <div className="container">
                            <div {...getPhotoRootProps({ style: photoStyle })}>
                                <input {...getPhotoInputProps()} />
                                <div>
                                    {photoFiles.length < 1 ? (
                                        <div style={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: ctx.imageSitePhotoPlaceholder }} />
                                    ) : (
                                        <div>{photoFile}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Stack>
                    <Stack style={{ width: "50%" }}>
                        <FormSection text={"Site Location"} />
                        <div className="container">
                            <div {...getLocationRootProps({ style: locationStyle })}>
                                <input {...getLocationInputProps()} />
                                <div>
                                    {locationFiles.length < 1 ? (
                                        <div style={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: ctx.imageSiteLocationPlaceholder }} />
                                    ) : (
                                        <div>{locationFile}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Stack>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingTop: 10,
                    }}
                >
                    <div style={{ width: "50%", textAlign: "center" }}>
                        {ctx.hasEditPermission && photoFiles.length > 0 &&
                            <DefaultButton onClick={removePhotoFile}>Delete Photo Image</DefaultButton>}
                    </div>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        {ctx.hasEditPermission && locationFiles.length > 0 && (
                            <DefaultButton onClick={removeLocationFile}>Delete Location Image</DefaultButton>
                        )}
                    </div>
                </div>
            </Stack>
        </>
    );
};
