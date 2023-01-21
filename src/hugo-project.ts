import { javascript } from 'projen';
import { CloudinaryConfiguration } from './cloudinary-configuration';
import { HugoConfiguration, Site } from './hugo-configuration';
import { Netlify, NetlifyConfiguration } from './netlify-configuration';

export interface HugoProjectOptions extends javascript.NodeProjectOptions {
  readonly hugoVersion: string;
  readonly hugoConfiguration: HugoConfiguration;
  readonly netlifyConfiguration?: NetlifyConfiguration;
  readonly cloudinaryConfiguration: CloudinaryConfiguration;
}

export class HugoProject extends javascript.NodeProject {

  public readonly site: Site;

  public readonly netlify: Netlify;

  constructor(options: HugoProjectOptions) {
    super(options);

    this.site = new Site(this, options);
    this.netlify = new Netlify(this, options);
  }
}