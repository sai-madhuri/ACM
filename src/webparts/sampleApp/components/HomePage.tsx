import * as React from "react";
import { sp, IItem, IAttachmentInfo } from "@pnp/sp/presets/all";
import styles from "./Homapage.module.scss";
import { getMyDonationOffers } from "../services/DashBoardService";
import { Application } from '../../Models/Campaign'
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon, Label, TextField, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import DashboardComponent from "../components/Dashboard/Dashboard";
import AdminComponent from "../components/Admin/AdminComponent";
import { Link } from "react-router-dom";

export interface IHomePageState {
    campaignsList: Array<any>,
    showAdminComponent: boolean,
    showDashBoardComponent: boolean,
    selectedCampaign: any,
    imageUrls: any
}

export default class HomePageComponent extends React.Component<any, IHomePageState>{
    imageUrl: string = ""
    constructor(props) {
        super(props);
        this.getAllCampaigns = this.getAllCampaigns.bind(this);
        this.getImageRelativeUrl = this.getImageRelativeUrl.bind(this);
        this.showSelectedCampaign = this.showSelectedCampaign.bind(this);
        this.showAdminComponent = this.showAdminComponent.bind(this);
        this.state = { campaignsList: [], showAdminComponent: false, showDashBoardComponent: false, selectedCampaign: {}, imageUrls: {} };
    }

    componentDidMount() {
        this.getAllCampaigns();
    }

    async getAllCampaigns() {
        let finalItems = {}
        await sp.web.lists.getByTitle("CampaignList").items.get().then(async result => {
            result.forEach(async campaign => {
                let imageItem = {}
                await sp.web.lists.getByTitle("CampaignList").items.getById(campaign.Id).attachmentFiles.get().then(result => {
                    if (result.length > 0) {
                        finalItems[campaign.Title] = result[0].ServerRelativeUrl;
                    }
                    else finalItems[campaign.Title] = "https://www.w3schools.com/html/pic_trulli.jpg";
                })
                this.setState({ campaignsList: result, imageUrls: finalItems });
            })
        });
        let retrievedobject = localStorage.getItem("currentUser");
        let currentUser = JSON.parse(retrievedobject);
        console.log("Current User Id : ", currentUser.Id);
        console.log("Campaigns List : ", this.state.campaignsList, " Image Urls : ", this.state.imageUrls)
    }

    getShortTitle(title: string) {
        if (title.length > 15) {
            let index = title.lastIndexOf(".");
            if (index > 0 && index < 15) return title.substring(0, index).replace(/_/g, "-");
            else return title.substring(0, 15).replace(/_/g, "-") + "...";
        }
        else return title.replace(/_/g, "-");
    }

    getShortDescription(description: string) {
        if (description.length > 25) {
            return description.substring(0, 25) + "...";
        }
        else return description;
    }

    async getImageRelativeUrl(campaign) {
        return await sp.web.lists.getByTitle("CampaignList").items.getById(campaign.Id).attachmentFiles.get().then(result => {
            if (result.length > 0) {
                return result[0].ServerRelativeUrl;
            }
            else return "https://www.w3schools.com/html/pic_trulli.jpg";
        })
    }

    getImageUrl(campaign) {
        return this.getImageRelativeUrl(campaign).then(result => {
            result;
        }).then(item => {
            item;
        })
    }

    showAdminComponent() {
        this.setState({ showAdminComponent: true, showDashBoardComponent: false });
    }

    showSelectedCampaign(campaign) {
        this.setState({ selectedCampaign: campaign, showDashBoardComponent: true })
    }

    render() {
        return (
            this.state.showDashBoardComponent ? <DashboardComponent campaign={this.state.selectedCampaign} /> :
                // this.state.showAdminComponent ? <AdminComponent /> :
                <div className={styles.acmProject}>
                    <div className={styles.container}>
                        <div className={styles.header + "  ms-Grid-row "}>
                            <span> Campaigns GoodLuck </span>
                        </div>
                        <div className={styles.bodyContainer}>
                            <div className={styles.campaigns}>
                                {this.state.campaignsList.map((campaign, key) => (
                                    <div key={key} className={styles.campaign}>
                                        <Link className={styles.linkStyles} to={{ pathname: `/dashBoard/${campaign.Title}`, state: { campaign } }}>
                                            {/* <div className={styles.innerCampaign} onClick={() => this.showSelectedCampaign(campaign)}> */}
                                            <div className={styles.innerCampaign}>
                                                <div>
                                                    <img src={this.state.imageUrls[campaign.Title]} className={styles.entireColumn} alt="Campaign Image" />
                                                </div>
                                                <div className={styles.logoName}>
                                                    {campaign.Title}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                                )}
                                <div className={styles.campaign}>
                                    <Link className={styles.linkStyles} to="/addCampaign">
                                        <div className={styles.innerCampaign}>
                                            <div className={styles.AddIcon}>
                                                <Icon iconName="Add" />
                                            </div>
                                            <div className={styles.logoName}>
                                                Add New Campaign
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}