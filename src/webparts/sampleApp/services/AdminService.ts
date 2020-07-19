import { sp, ChoiceFieldFormatType, DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType, FieldUserSelectionMode } from "@pnp/sp/presets/all";
import { Application, Field, FieldType } from "../../Models/Campaign";

export const createList = async (application: Application) => {
    let donorListName = application.Name + "Donors";
    let requestsListName = application.Name + "Requests";
    const listEnsureResult = await sp.web.lists.ensure(donorListName, application.Description, 100);
    if (listEnsureResult.created) {
        await sp.web.lists.ensure(requestsListName, application.Description, 100).then(async result => {
            await sp.web.lists.getByTitle("CampaignList").items.add({
                Title: application.Name,
                CampaignDescription: application.Description
            }).then(async result => {
                result.item.attachmentFiles.addMultiple(application.Logo).then(item => {
                    console.log("Item : ", item)
                    return result;
                });
                application.DonorFields.forEach(async field => {
                    await addFieldToList(donorListName, field)
                })
                await new Promise((resolve) => setTimeout(resolve, 5000));
                application.RequestorFields.forEach(async field => {
                    await addFieldToList(requestsListName, field)
                })
                await new Promise((resolve) => setTimeout(resolve, 5000));
                var donfield3 = new Field();
                donfield3.Name = "FinalStatus";
                donfield3.type = FieldType.Dropdown;
                donfield3.typevalues = JSON.stringify([`Started`, `Pending`, `Completed`]);
                await addFieldToList(requestsListName, donfield3).then(async successResult =>
                    await addFieldToList(donorListName, donfield3).then(result => {
                        var applicantField = new Field();
                        applicantField.Name = "ApplicantData";
                        applicantField.type = FieldType.TextArea;
                        addFieldToList(requestsListName, applicantField);
                    })
                );
            })
        })
    }
    else {
        console.log("List already exists!");
    }
}

export const addFieldToList = async (listName, field: Field) => {
    let group = listName + "Group";

    switch (field.type) {
        case 'Textbox': await sp.web.lists.getByTitle(listName).fields.addText(field.Name, 255, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'Dropdown': await sp.web.lists.getByTitle(listName).fields.
            addChoice(field.Name, field.typevalues.split(","), ChoiceFieldFormatType.Dropdown, false, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'Number': await sp.web.lists.getByTitle(listName).fields.addNumber(field.Name, 0, Number.MAX_VALUE, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'DateTime': sp.web.lists.getByTitle(listName).fields
            .addDateTime(field.Name, DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'TextArea': sp.web.lists.getByTitle(listName).fields.addMultilineText(field.Name, 10, false, false, false, true, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'PeoplePicker': sp.web.lists.getByTitle(listName).fields.addUser(field.Name, FieldUserSelectionMode.PeopleAndGroups, { Group: group })
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;

        case 'Radio': sp.web.lists.getByTitle(listName).fields.addBoolean(field.Name, { Group: group });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;
    }
}
