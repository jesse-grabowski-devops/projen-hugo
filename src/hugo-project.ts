import { javascript } from 'projen';
import { CloudinaryConfiguration } from './cloudinary-configuration';
import { HugoConfiguration, Site } from './hugo-configuration';

export interface HugoProjectOptions extends javascript.NodeProjectOptions {
  readonly hugoVersion: string;
  readonly hugoConfiguration: HugoConfiguration;
  readonly cloudinaryConfiguration: CloudinaryConfiguration;
}

export class HugoProject extends javascript.NodeProject {

  public readonly site: Site;

  constructor(options: HugoProjectOptions) {
    super(options);

    this.site = new Site(this, options.hugoConfiguration, options.cloudinaryConfiguration);
  }
}