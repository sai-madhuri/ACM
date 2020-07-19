import * as React from 'react';
import styles from './DonarForm.module.scss'
import { Application, Field, FieldType, FormType, EnumField } from '../../../Models/Campaign'
import { Icon, Label, TextField } from 'office-ui-fabric-react';
import { CommandBarButton, IContextualMenuProps, IIconProps, Stack, IStackStyles, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


export interface IDonarFormComponentProps {

}

export interface IDonarFormComponentState {
    Fields: Array<Field>
}

export default class DonarFormComponent extends React.Component<any, IDonarFormComponentState> {
    dropdownValues: IDropdownOption[] = [];
    addIcon: IIconProps = { iconName: 'Add' };
    file: Array<any> = [];
    constructor(props: any) {
        super(props);
        var fields = [];
        var f1: Field = new Field();
        f1.Name = "Name"
        f1.type = FieldType.Textbox;

        var f2: Field = new Field();
        f2.Name = "Address"
        f2.type = FieldType.TextArea;

        var f3: Field = new Field();
        f3.Name = "RequestTo"
        f3.type = FieldType.PeoplePicker;

        var f4: Field = new Field();
        f4.Name = "Gender"
        f4.type = FieldType.Radio;
        f4.typevalues = "Male, Female"


        var f5: Field = new Field();
        f5.Name = "Fruit"
        f5.type = FieldType.Dropdown;
        f5.typevalues = "Apple, Banana, Mango"

        var f6: Field = new Field();
        f6.Name = "Flower"
        f6.type = FieldType.Dropdown;
        f6.typevalues = "Rose, Lilly"


        fields.push(f1);
        fields.push(f2);
        fields.push(f3);
        fields.push(f4);
        fields.push(f5);
        fields.push(f6);
        this.state = { Fields: fields }
        this.saveForm = this.saveForm.bind(this);
        this.cancelForm = this.cancelForm.bind(this);


    }
    onChangeValue(key: number, val: any) {

        var fields = this.state.Fields;
        var field = { ...fields[key] };
        field.value = val;
        fields[key] = field;
        this.setState({ Fields: fields })


    }
    saveForm() {
        console.log(this.state.Fields);

    }
    cancelForm() {

    }

    public render(): React.ReactElement<any> {

        return (
            <div className={styles.acmProject}>
                <div className={styles.container}>
                    <div className={styles.header + "  ms-Grid-row "}>
                        <span>Donar Form </span>
                    </div>
                    <div className={styles.bodyContainer}>
                        {
                            this.state.Fields && this.state.Fields.map((field, key) => {


                                switch (field.type) {
                                    case FieldType.Textbox:
                                        return (
                                            <div key={key} className={styles.rowMargin + " ms-Grid-row "}>
                                                <div className={styles.fontStyle + " ms-Grid-col ms-sm3"}>{field.Name}</div>
                                                <div className=" ms-Grid-col ms-sm6">  <TextField value={field.value} onChange={(e: any) => this.onChangeValue(key, e.target.value)} /></div>

                                            </div>

                                        )
                                        break;
                                    case FieldType.TextArea:
                                        return (
                                            <div key={key} className={styles.rowMargin + " ms-Grid-row "}>
                                                <div className={styles.fontStyle + " ms-Grid-col ms-sm3"}>{field.Name}</div>
                                                <div className=" ms-Grid-col ms-sm6">  <TextField value={field.value} onChange={(e: any) => this.onChangeValue(key, e.target.value)} /> </div>

                                            </div>


                                        )
                                        break;
                                    case FieldType.Radio:
                                        var options: IChoiceGroupOption[] = [];

                                        field.typevalues.split(',').map(typevalue => {
                                            options.push({ key: typevalue, text: typevalue })
                                        })
                                        return (
                                            <div key={key} className={styles.rowMargin + " ms-Grid-row "}>
                                                <div className={styles.fontStyle + " ms-Grid-col ms-sm3"}>{field.Name}</div>
                                                <div className=" ms-Grid-col ms-sm6"> <ChoiceGroup selectedKey={field.value} options={options} required={true} onChanged={(e: any) => this.onChangeValue(key, e.key)} /> </div>

                                            </div>

                                        )
                                        break;

                                    case FieldType.Dropdown:
                                        var dropdownOptions: IDropdownOption[] = [

                                        ];
                                        field.typevalues.split(',').map(typevalue => {
                                            dropdownOptions.push({ key: typevalue, text: typevalue })
                                        })
                                        return (
                                            <div key={key} className={styles.rowMargin + " ms-Grid-row "}>
                                                <div className={styles.fontStyle + " ms-Grid-col ms-sm3"}>{field.Name}</div>
                                                <div className=" ms-Grid-col ms-sm6"> <Dropdown
                                                    placeholder="Select an option"
                                                    options={dropdownOptions}
                                                    selectedKey={field.value}
                                                    onChanged={(e: any) => this.onChangeValue(key, e.key)}
                                                /> </div>

                                            </div>
                                        )
                                        break;

                                }

                            })
                        }

                        <div className={styles.btnAlignment + " ms-Grid-row "}>
                            <DefaultButton text="Save" className={styles.saveBtn} onClick={this.saveForm} />
                            <DefaultButton text="Cancel" className="" onClick={this.cancelForm} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}