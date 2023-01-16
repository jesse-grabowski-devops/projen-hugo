import { github } from 'projen';
import { HugoConfiguration, Site } from './hugo-configuration';

export interface HugoProjectOptions extends github.GitHubProjectOptions {
  readonly hugoVersion: string;
  readonly hugoConfiguration: HugoConfiguration;
}

export class HugoProject extends github.GitHubProject {
  constructor(options: HugoProjectOptions) {
    super(options);

    const site = new Site(this, options.hugoConfiguration);
  }
}