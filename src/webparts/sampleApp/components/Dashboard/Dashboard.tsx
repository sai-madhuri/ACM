import * as React from 'react';
import styles from './Dashboard.module.scss';
import { Application, Field, FieldType, FormType, EnumField } from '../../../Models/Campaign'
import { Icon, Label, TextField, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { CommandBarButton, IContextualMenuProps, IIconProps, Stack, IStackStyles, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { getAllActiveDonations, getAllActiveRequests } from "../../services/DashBoardService";

export interface IDashboardComponentState {
    application: Application,
    Requestors: Array<any>,
    Donars: Array<any>,
    DonarRequestor: Array<any>,
    frequentDonars: Array<any>,
}

export enum TableName {
    BloodDonation = "BloddDonation"
}

export default class DashboardComponent extends React.Component<any, IDashboardComponentState> {
    listName = TableName.BloodDonation;
    constructor(props) {
        super(props);
        var application = this.props.campaign;
        this.state = { application: application, Donars: [], Requestors: [], DonarRequestor: [], frequentDonars: [] }

        //donars.push({ Name: "Sunanda", MobileNumber: "9988776655", BloodGroup: "A+", CreatedOn: new Date("2/2/2020") });
        //donars.push({ Name: "Madhuri", MobileNumber: "9445587694", BloodGroup: "0+", CreatedOn: new Date("2/2/2020") });
    }

    async componentDidMount() {
        let campaignName = this.props.match.params.campaignName;
        console.log("DashBoard CampaignName : ", campaignName);
        console.log(" state : ", this.props.location.state);

        await getAllActiveDonations(campaignName).then(result => {
            console.log("Donations : ", result);
            this.setState({ Donars: result });
        })

        await getAllActiveRequests(campaignName).then(result => {
            console.log("Requests : ", result);
            this.setState({ Requestors: result });
        })

        var requestors = [];
        requestors.push({ Name: "Sai Venkat", MobileNumber: "9988776655", CreatedOn: new Date("7/17/2020"), BloodGroup: "A+" });
        requestors.push({ Name: "John", MobileNumber: "9988776655", CreatedOn: new Date("7/19/2020"), BloodGroup: "0+" });
        requestors.push({ Name: "Ramesh", MobileNumber: "9988776655", CreatedOn: new Date("7/18/2020"), BloodGroup: "A+" });

        var DonarRequestor = [];
        if (this.listName == TableName.BloodDonation) {
            DonarRequestor.push({ Name: "Uday", Requestor: "Mikel", MobileNumber: "9988776655", CreatedOn: new Date("2/2/2020"), BloodGroup: "A+" });
            DonarRequestor.push({ Name: "Sai Venkat", Requestor: "Nikhil", MobileNumber: "9988776655", CreatedOn: new Date("2/2/2020"), BloodGroup: "A+" });
        }

        var application = this.props.campaign;
        var frequentDonars = [];
        if (this.listName == TableName.BloodDonation) {
            frequentDonars.push({ Name: "Dasari Arun", Count: 6 });
            frequentDonars.push({ Name: "Uday", Count: 2 });
            frequentDonars.push({ Name: "ABC", Count: 3 });
        }
        this.setState({ application: application, frequentDonars: frequentDonars, DonarRequestor: DonarRequestor })

    }

    getFormattedDate = (date): string => {
        // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear());
        var today = new Date(date);
        var dd = today.getDate().toString();
        var mm = (today.getMonth() + 1).toString();
        var yyyy = today.getFullYear();
        if (parseInt(dd) < 10) {
            dd = "0" + dd.toString();
        }
        if (parseInt(mm) < 10) {
            mm = "0" + mm.toString();
        }

        return dd + "/" + mm + "/" + yyyy;
    };

    render() {
        return (
            <div className={styles.acmProject}>
                <div className={styles.container}>
                    <div className={styles.header + "  " + styles.row}>
                        <span> {this.props.match.params.campaignName} </span>
                    </div>
                    <div className={styles.bodyContainer}>
                        <div className={styles.mainContainer}>
                            <div className={styles.row}>
                                <div className={styles.col6}>
                                    <div className={styles.gridHeight}>
                                        <div className={styles.tileHeader}>Available Donors</div>
                                        <div className={styles.textStyles + "  " + styles.row}>
                                            <div className={styles.columnsHeader + "  " + styles.col4}>Name</div>
                                            <div className={styles.columnsHeader + " " + styles.col4}>{this.props.match.params.campaignName == "BloodDonation" ? "Blood Group" : "OfferedOn"}
                                            </div>
                                            <div className={styles.columnsHeader + " " + styles.col4}>Contact</div>
                                        </div>
                                        {
                                            this.state.Donars && this.state.Donars.length > 0 && this.state.Donars.map((donar, key) => {
                                                return (
                                                    <div key={key} className={styles.textStyles + "  " + styles.row}>
                                                        <div className={styles.col4}>{donar.Title}</div>
                                                        <div className={styles.col4}>{this.props.match.params.campaignName == "BloodDonation" ? donar.BloodGroup : this.getFormattedDate(donar.Created)}</div>
                                                        <div className={styles.col4}>{donar.MobileNumber}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                                <div className={styles.col6}>
                                    <div className={styles.gridHeight}>
                                        <div className={styles.tileHeader}>Requestors</div>
                                        <div className={styles.textStyles + "  " + styles.row}>
                                            <div className={styles.columnsHeader + "  " + styles.col4}>Name</div>

                                            <div className={styles.columnsHeader + "  " + styles.col4}>  Requsted On</div>
                                            <div className={styles.columnsHeader + " " + styles.col4}>{this.props.match.params.campaignName == "BloodDonation" ? "Blood Group" : "Mobile Number"}</div>
                                        </div>
                                        {

                                            this.state.Requestors && this.state.Requestors.length > 0 && this.state.Requestors.map((donar, key) => {
                                                return (
                                                    <div key={key} className={styles.textStyles + "  " + styles.row}>
                                                        <div className={styles.col4}>{donar.Title}</div>
                                                        <div className={styles.col4}>{this.getFormattedDate(donar.Created)}</div>
                                                        <div className={styles.col4}>{this.props.match.params.campaignName == "BloodDonation" ? donar.BloodGroup : donar.MobileNumber}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.col6}>

                                    <div className={styles.gridHeight}>
                                        <div className={styles.tileHeader}>Donor - Requestor</div>
                                        <div className={styles.textStyles + "  " + styles.row}>
                                            <div className={styles.columnsHeader + "  " + styles.col4}>Donor Name</div>
                                            <div className={styles.columnsHeader + "  " + styles.col4}>Donated To</div>
                                            <div className={styles.columnsHeader + "  " + styles.col4}>Donated On</div>
                                        </div>
                                        {

                                            this.state.DonarRequestor && this.state.DonarRequestor.length > 0 && this.state.DonarRequestor.map((donar, key) => {
                                                return (
                                                    <div key={key} className={styles.textStyles + "  " + styles.row}>
                                                        <div className={styles.col4}>{donar.Name}</div>
                                                        <div className={styles.col4}>{donar.Requestor}</div>
                                                        <div className={styles.col4}>{donar.CreatedOn.toLocaleDateString()}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={styles.col6}>
                                    <div className={styles.gridHeight}>
                                        <div className={styles.tileHeader}>Frequently Donated Members</div>
                                        <div className={styles.textStyles + "  " + styles.row}>
                                            <div className={styles.columnsHeader + " " + styles.col4}>Name</div>
                                            <div className={styles.columnsHeader + " " + styles.col8}>Number of Times Donated</div>

                                        </div>
                                        {
                                            this.state.frequentDonars && this.state.frequentDonars.length > 0 && this.state.frequentDonars.map((donar, key) => {
                                                return (
                                                    <div key={key} className={styles.textStyles + "  " + styles.row}>
                                                        <div className={styles.col4}>{donar.Name}</div>
                                                        <div className={styles.col8}>{donar.Count}</div>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}