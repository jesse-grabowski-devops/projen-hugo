import { javascript } from 'projen';
import { CloudinaryConfiguration } from './cloudinary-configuration';
import { HugoConfiguration, Site } from './hugo-configuration';
import { SiteDirectories } from './hugo-directory-configuration';
import { Netlify, NetlifyConfiguration } from './netlify-configuration';
import { PostCSS, PostcssConfiguration } from './postcss-configuration';

export interface HugoProjectOptions extends javascript.NodeProjectOptions {
  readonly hugoVersion: string;
  readonly hugoConfiguration: HugoConfiguration;
  readonly netlifyConfiguration?: NetlifyConfiguration;
  readonly cloudinaryConfiguration: CloudinaryConfiguration;
  readonly postcssConfiguration?: PostcssConfiguration;
}

export class HugoProject extends javascript.NodeProject {

  public readonly site: Site;

  public readonly siteDirectories: SiteDirectories;

  public readonly netlify: Netlify;

  public readonly postcss: PostCSS;

  constructor(options: HugoProjectOptions) {
    super({
      ...options,
      // if netlify is enabled, do not create github actions for release by default
      release: options?.release ?? !(options?.netlifyConfiguration?.enabled ?? false),
      buildWorkflow: options?.buildWorkflow ?? !(options?.netlifyConfiguration?.enabled ?? false),
    });

    this.addGitIgnore('.idea');

    this.site = new Site(this, options);
    this.siteDirectories = new SiteDirectories(this, options);
    this.postcss = new PostCSS(this, options);

    this.netlify = new Netlify(this, options);
  }
}