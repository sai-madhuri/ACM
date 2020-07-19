import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import styles from "./components/SampleApp.module.scss";
import * as strings from 'SampleAppWebPartStrings';
import SampleApp from './components/SampleApp';
import { ISampleAppProps } from './components/ISampleAppProps';
import { sp } from "@pnp/sp/presets/all";
import { rootComponent } from './RootComponent';

export interface ISampleAppWebPartProps {
  description: string;
  context: WebPartContext;
}

export default class SampleAppWebPart extends BaseClientSideWebPart<ISampleAppWebPartProps> {

  public async render(): Promise<void> {

    await sp.site.rootWeb.ensureUser(this.context.pageContext.user.email).then(result => {
      localStorage.setItem("currentUser", JSON.stringify(result.data));
    });
    // const element: React.ReactElement<ISampleAppProps> = React.createElement(
    //   SampleApp,
    //   {
    //     description: this.properties.description,
    //     context: this.context
    //   }
    // );

    // ReactDom.render(element, this.domElement);
    console.log("Updated");
    const element = rootComponent(this.context);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const _ = await super.onInit();
    sp.setup({
      spfxContext: this.context
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
