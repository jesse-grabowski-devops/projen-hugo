import { javascript } from 'projen';
import { HugoConfiguration, Site } from './hugo-configuration';

export interface HugoProjectOptions extends javascript.NodeProjectOptions {
  readonly hugoVersion: string;
  readonly hugoConfiguration: HugoConfiguration;
}

export class HugoProject extends javascript.NodeProject {

  public readonly site: Site;

  constructor(options: HugoProjectOptions) {
    super(options);

    this.site = new Site(this, options.hugoConfiguration);
  }
}