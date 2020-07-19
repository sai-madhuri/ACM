import * as React from 'react';
import styles from './SampleApp.module.scss';
import { ISampleAppProps } from './ISampleAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import HomePageComponent from "./HomePage";

export default class SampleApp extends React.Component<ISampleAppProps, {}> {
  public render(): React.ReactElement<ISampleAppProps> {
    return (
      <HomePageComponent />
    );
  }
}
