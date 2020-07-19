import * as React from 'react';
import styles from './AdminComponent.module.scss';
import { Application, Field, FieldType, FormType, EnumField } from '../../../Models/Campaign'
import { Icon, Label, TextField, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { CommandBarButton, IContextualMenuProps, IIconProps, Stack, IStackStyles, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { createList } from "../../services/AdminService";
import { Link } from "react-router";
import HomePageComponent from '../HomePage';
import Loader from "react-loader-spinner";

export interface IAdminComponentProps {
    history: any;
}

export interface IAdminComponentState {
    appliacation: Application,
    showHomePageComponent: boolean,
    showLoader: boolean
}

export default class AdminComponent extends React.Component<IAdminComponentProps, IAdminComponentState> {
    dropdownValues: IDropdownOption[] = [];
    addIcon: IIconProps = { iconName: 'Add' };
    file: Array<any> = [];
    logo: Array<any> = [];

    constructor(props: IAdminComponentProps) {
        super(props);
        var appliacation = new Application();

        var field1 = new Field();
        field1.Name = "Name"
        field1.type = FieldType.Textbox;
        field1.IsRequired = true;

        var field2 = new Field();
        field2.Name = "Mobile Number"
        field2.type = FieldType.Textbox;
        field2.IsRequired = true;

        var field3 = new Field();
        field3.Name = "Donars"
        field3.type = FieldType.PeoplePicker;
        field3.IsRequired = true;

        appliacation.RequestorFields = [];
        appliacation.RequestorFields.push(field1);
        appliacation.RequestorFields.push(field2)
        appliacation.RequestorFields.push(field3)

        var donfield1 = new Field();
        donfield1.Name = "Name"
        donfield1.type = FieldType.Textbox;
        donfield1.IsRequired = true;

        var donfield2 = new Field();
        donfield2.Name = "Mobile Number"
        donfield2.type = FieldType.Textbox;
        donfield2.IsRequired = true;

        appliacation.DonorFields = [];
        appliacation.DonorFields.push(donfield1);
        appliacation.DonorFields.push(donfield2);

        appliacation.Logo = [];

        for (let value in FieldType) {
            this.dropdownValues.push({ key: value, text: value })
        }
        this.state = {
            appliacation: appliacation,
            showHomePageComponent: false,
            showLoader: false
        };
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.checkFileType = this.checkFileType.bind(this);
        this.saveCampaign = this.saveCampaign.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    onAdd(type: string) {
        var application = this.state.appliacation;
        var requestorFields = this.state.appliacation.RequestorFields;
        var DonarsFields = this.state.appliacation.DonorFields;
        if (type == FormType.Requestor) {
            var field: Field = new Field();
            field.type = FieldType.Textbox;
            field.Name = "";
            field.typevalues = "";
            requestorFields.push(field);
        }

        else {

            var donarfield: Field = new Field();
            donarfield.type = FieldType.Textbox;
            donarfield.Name = "";
            donarfield.typevalues = "";
            DonarsFields.push(donarfield);
        }
        application.RequestorFields = requestorFields;
        application.DonorFields = DonarsFields;
        this.setState({ appliacation: application })
    }

    onDelete(type: string, key: number) {
        var application = this.state.appliacation;
        var requestorFields = this.state.appliacation.RequestorFields;
        var DonarsFields = this.state.appliacation.DonorFields;
        if (type == FormType.Requestor)
            requestorFields.splice(key, 1)
        else {
            DonarsFields.splice(key, 1)
        }
        application.RequestorFields = requestorFields;
        application.DonorFields = DonarsFields;
        this.setState({ appliacation: application })
    }

    onChangeValue(key: number, fieldName: string, event: any, type: string) {

        var application = this.state.appliacation;
        var requestorFields = this.state.appliacation.RequestorFields;
        var DonarsFields = this.state.appliacation.DonorFields;
        if (type == FormType.Name) {
            application.Name = event.target.value
        }
        if (type == FormType.Description) {
            application.Description = event.target.value
        }

        else if (type == FormType.Requestor) {
            var requestor = requestorFields[key];
            if (fieldName == EnumField.Name) {
                requestor.Name = event.target.value
            }
            else if (fieldName == EnumField.type) {
                requestor.type = event.key
            }
            else if (fieldName == EnumField.typevalues) {
                requestor.typevalues = event.target.value
            }
            else if (fieldName == EnumField.IsRequired) {
                requestor.IsRequired = event.target.value
            }
            requestorFields[key] = requestor;
        }

        else {
            var donar = DonarsFields[key];
            if (fieldName == EnumField.Name) {
                donar.Name = event.target.value
            }
            else if (fieldName == EnumField.type) {
                donar.type = event.key
            }
            else if (fieldName == EnumField.typevalues) {
                donar.typevalues = event.target.value
            }
            else if (fieldName == EnumField.IsRequired) {
                donar.IsRequired = event.target.value
            }
            DonarsFields[key] = donar
        }
        application.RequestorFields = requestorFields;
        application.DonorFields = DonarsFields;
        this.setState({ appliacation: { ...application } })
    }

    checkFileType(files: FileList) {
        this.file = [];
        this.logo = [];
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var fileType = files[i].name.replace(/^.*\./, '').toLowerCase();
                if (fileType == "jpg" || fileType == "png") {
                    this.file.push({
                        name: files[i].name,
                        content: files[i]
                    });
                    this.logo.push(files[i]);
                }
            }
        }
        else {
            if (this.file.length <= 0)
                this.file = [];
        }
        var application = { ... this.state.appliacation };
        application.Logo = this.file
        this.setState({
            appliacation: application
        });
        var fileUploader: any = document.getElementById('fileuploader');
        //  (fileUploader != null && fileUploader != undefined && fileUploader != '') ? fileUploader.value = null : '';
    }

    saveCampaign() {
        this.setState({ showLoader: true, showHomePageComponent: false });
        createList(this.state.appliacation).then(result => {
            this.setState({ showHomePageComponent: true, showLoader: false });
            this.props.history.push("/");
        });
        console.log(this.state.appliacation)
    }

    cancel() {
        this.setState({ showHomePageComponent: true });
        history.pushState(this.state.appliacation, "", "#/");
    }

    public render(): React.ReactElement<any> {
        return (
            this.state.showLoader ? <div
                style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            > <Loader type="ThreeDots" color="rgb(118,83,252)" height="100" width="100" /></div> :
                this.state.showHomePageComponent ? <HomePageComponent /> :
                    <div className={styles.acmProject}>
                        <div className={styles.container}>
                            <div className={styles.header}>
                                <span>New Campaign </span>
                            </div>
                            <div className={styles.bodyContainer}>
                                <div className={styles.fieldMargin}>
                                    <div className={styles.Requestors}>Name :</div>
                                    <div className={styles.textBoxColumn}> <TextField className={styles.borderRadius} value={this.state.appliacation.Name} required onChange={(e) => this.onChangeValue(0, '', e, FormType.Name)} /></div>
                                </div>
                                <div className={styles.fieldMargin}>
                                    <div className={styles.Requestors}>Description :</div>
                                    <div className={styles.textBoxColumn}> <TextField className={styles.borderRadius} multiline rows={3} value={this.state.appliacation.Description} onChange={(e) => this.onChangeValue(0, '', e, FormType.Description)} required /></div>
                                </div>
                                <div className={styles.fieldMargin}>
                                    <div className={styles.Requestors}>Logo :</div>
                                    <div className={styles.textBoxColumn}>
                                        {
                                            this.state.appliacation && this.state.appliacation.Logo && this.state.appliacation.Logo.length > 0 ? (<Image width={100} height={100} src={URL.createObjectURL(this.logo[0])} />) :
                                                <div>
                                                    <input id="fileuploader" type="file" onChange={e => this.checkFileType(e.target.files)} className="d-none" />
                                                </div>
                                        }
                                    </div>


                                </div>


                                <div >
                                    <div className={styles.rowHeading}>
                                        <span className={styles.Requestors}>Donor Template :</span>
                                    </div>

                                    <div className={styles.rowMargin}>
                                        <div className={styles.fieldStyles}>
                                            Field Name
                                    </div>
                                        <div className={styles.fieldStyles}>
                                            Field Type
                                    </div>
                                        <div className={styles.fieldStyles}>
                                            Field Type Category
                                    </div>
                                        <div className={styles.fieldStyles + " " + styles.checkBoxColumn}>
                                            Is Required
                                    </div>
                                    </div>


                                    {
                                        this.state && this.state.appliacation && this.state.appliacation.DonorFields && this.state.appliacation.DonorFields.map((field, key) => {
                                            var disbaledropdown = key < 2 || field.type == FieldType.Textbox || field.type == FieldType.TextArea || field.type == FieldType.PeoplePicker;
                                            return (
                                                <div key={key}>
                                                    <div className={styles.rowMargin}>
                                                        <div className={styles.smallColumn}> <TextField value={field.Name} disabled={key < 2} onChange={(e) => this.onChangeValue(key, EnumField.Name, e, FormType.Donar)} /></div>
                                                        <div className={styles.smallColumn}>
                                                            <Dropdown
                                                                defaultSelectedKey={field.type}
                                                                selectedKey={field.type}
                                                                disabled={key < 2}
                                                                options={this.dropdownValues}
                                                                onChanged={(e) => this.onChangeValue(key, EnumField.type, e, FormType.Donar)}
                                                            />
                                                        </div>
                                                        <div className={styles.smallColumn}> <TextField disabled={disbaledropdown} onChange={(e) => this.onChangeValue(key, EnumField.typevalues, e, FormType.Donar)} /></div>

                                                        <div className={styles.iconColumn}>
                                                            <Checkbox checked={field.IsRequired} disabled={key < 2} onChange={(e) => this.onChangeValue(key, EnumField.IsRequired, e, FormType.Donar)} />
                                                        </div>
                                                        {
                                                            key > 1 ?
                                                                <div className={styles.deleteIcon + " " + styles.iconColumn}><Icon iconName="Delete" onClick={() => this.onDelete(FormType.Donar, key)} /> </div>
                                                                : <div></div>
                                                        }
                                                    </div>

                                                </div>


                                            )
                                        })



                                    }
                                    <div className={`${styles.rowMargin} ${styles.alignment}`}>
                                        <PrimaryButton text="Add More Fields" allowDisabledFocus iconProps={this.addIcon} onClick={() => this.onAdd(FormType.Donar)} />
                                    </div>
                                </div>

                                <div >
                                    <div className={styles.rowHeading}>
                                        <span className={styles.Requestors}>Requestor Template :</span>
                                    </div>
                                    <div className={styles.rowMargin}>
                                        <div className={styles.fieldStyles}>
                                            Field Name
                                    </div>
                                        <div className={styles.fieldStyles}>
                                            Field Type
                                    </div>
                                        <div className={styles.fieldStyles}>
                                            Field Type Category
                                    </div>
                                        <div className={styles.fieldStyles + " " + styles.checkBoxColumn}>
                                            Is Required
                                    </div>
                                    </div>

                                    {
                                        this.state && this.state.appliacation && this.state.appliacation.RequestorFields && this.state.appliacation.RequestorFields.map((field, key) => {
                                            return (
                                                <div key={key}>
                                                    <div className={styles.rowMargin}>
                                                        <div className={styles.smallColumn}> <TextField value={field.Name} disabled={key < 3} onChange={(e) => this.onChangeValue(key, EnumField.Name, e, FormType.Requestor)} /></div>
                                                        <div className={styles.smallColumn}>
                                                            <Dropdown
                                                                defaultSelectedKey={field.type}
                                                                selectedKey={field.type}
                                                                disabled={key < 3}
                                                                options={this.dropdownValues}
                                                                onChanged={(e) => this.onChangeValue(key, EnumField.type, e, FormType.Requestor)}
                                                            />
                                                        </div>
                                                        <div className={styles.smallColumn}> <TextField disabled={key < 3 || field.type == FieldType.Textbox || field.type == FieldType.TextArea || field.type == FieldType.PeoplePicker} value={field.typevalues} onChange={(e) => this.onChangeValue(key, EnumField.typevalues, e, FormType.Requestor)} /></div>
                                                        <div className={styles.iconColumn}>
                                                            <Checkbox checked={field.IsRequired} disabled={key < 3} onChange={(e) => this.onChangeValue(key, EnumField.IsRequired, e, FormType.Requestor)} />
                                                        </div>
                                                        {
                                                            key > 2 ?
                                                                <div className={styles.deleteIcon + " " + styles.iconColumn}><Icon iconName="Delete" onClick={() => this.onDelete(FormType.Requestor, key)} /> </div>
                                                                :
                                                                <div></div>
                                                        }
                                                    </div>

                                                </div>


                                            )
                                        })
                                    }
                                    <div className={`${styles.rowMargin} ${styles.alignment}`}>
                                        <PrimaryButton text="Add More Fields" allowDisabledFocus iconProps={this.addIcon} onClick={() => this.onAdd(FormType.Requestor)} />
                                    </div>
                                </div>


                                <div className={styles.btnAlignment}>
                                    <DefaultButton text="Save" className={styles.saveBtn} onClick={this.saveCampaign} />
                                    {/* <Link to="/" className={styles.linkStyles}> */}
                                    <DefaultButton text="Cancel" className="" onClick={this.cancel} />
                                    {/* </Link> */}
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                    </div>
        );
    }
}


