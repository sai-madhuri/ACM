import { sp } from "@pnp/sp/presets/all";
import { IHttpClientOptions, HttpClientResponse, HttpClient } from '@microsoft/sp-http';

export const getAllActiveDonations = async (listName: string) => {
    listName = listName + "Donors"
    return await sp.web.lists.getByTitle(listName).items.filter(`FinalStatus ne 'Completed'`).get().then(result => {
        return result;
    })
}

export const getAllActiveRequests = async (listName: string) => {
    listName = listName + "Requests";
    return await sp.web.lists.getByTitle(listName).items.filter(`FinalStatus ne 'Completed'`).get().then(result => {
        return result;
    })
}

export const getAllListFields = async (listName: string) => {
    let groupValue = listName + "Group"
    return await sp.web.lists.getByTitle(listName).fields.filter(`Group eq '${groupValue}'`).get().then(result => {
        return result;
    })
}

export const getMyDonationOffers = async (listName: string, userId) => {
    listName = listName + "Donors"
    return await sp.web.lists.getByTitle(listName).items.filter(`AuthorId eq ${userId}`).get().then(result => {
        return result;
    })
}

export const getAllDonationRequests = async (listName: string, donationId) => {
    listName = listName + "Requests"
    return await sp.web.lists.getByTitle(listName).items.filter(`DonationId eq '${donationId}'`).get().then(result => {
        return result;
    })
}

export const approveRequest = async (listName: string, request) => {
    let requestsListName = listName + "Requests"
    let applicantData = JSON.parse(request.ApplicantData)
    applicantData.Status = "Completed"
    applicantData = JSON.stringify(applicantData)
    return await sp.web.lists.getByTitle(requestsListName).items.getById(request.Id).update({
        FinalStatus: "Approved",
        ApplicantData: applicantData
    }).then(async result => {
        let donorsListName = listName + "Donors"
        await sp.web.lists.getByTitle(donorsListName).items.getById(request.DonationId).update({
            FinalStatus: "Completed"
        })
    })
}

export const submitRequest = async (listName: string, donationId, data, currentUser) => {
    let requestFinalData = {}
    Object.keys(data).forEach(item => {
        let name = data[item]["Name"];
        let value = data[item]["Value"];
        let type = data[item]["Type"]
        if (type == "PeoplePicker") {
            name = name + "Id";
        }
        requestFinalData[name] = value;
    })
    requestFinalData["FinalStatus"] = "Started";
    requestFinalData["DonationId"] = donationId;
    requestFinalData["ApplicantData"] = JSON.stringify({
        ApplicantName: currentUser.Name,
        Reason: data["Reason"]["Value"],
        Status: "Started"
    });
    return await sp.web.lists.getByTitle(listName).items.add(requestFinalData).then(result => {
        return result;
    })
}

export const createDonation = async (listName, data) => {
    let requestFinalData = {}
    Object.keys(data).forEach(item => {
        let name = data[item]["Name"];
        let value = data[item]["Value"];
        let type = data[item]["Type"]
        if (type == "PeoplePicker") {
            name = name + "Id";
        }
        requestFinalData[name] = value;
    })
    requestFinalData["FinalStatus"] = "Started";
    return await sp.web.lists.getByTitle(listName).items.add(requestFinalData).then(result => {
        return result;
    })
}