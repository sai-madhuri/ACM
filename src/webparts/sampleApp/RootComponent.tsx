import * as React from "react";
import { Switch, Route } from "react-router";
import { HashRouter } from "react-router-dom";
import HomePageComponent from "./components/HomePage";
import AdminComponent from "./components/Admin/AdminComponent";
import DashboardComponent from "./components/Dashboard/Dashboard";

export const rootComponent = function RootComponent(context) {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={HomePageComponent} />
                <Route exact path="/addCampaign" component={AdminComponent} />
                <Route exact path="/dashBoard/:campaignName" component={DashboardComponent} />
                <Route path="*" component={HomePageComponent} />
            </Switch>
        </HashRouter>
    )
}
