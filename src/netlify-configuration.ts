import { Component, Project, TomlFile } from 'projen';
import { resolve } from 'projen/lib/_resolve';
import { HugoProjectOptions } from './hugo-project';

export interface NetlifyBuildConfiguration {
  readonly publish: string;
  readonly command: string;
}

export interface NetlifyConfiguration {
  readonly enabled: boolean;
  readonly buildOptions?: NetlifyBuildConfiguration;
}

export class Netlify extends Component {
  public readonly options: HugoProjectOptions;

  constructor(project: Project, options: HugoProjectOptions) {
    super(project);
    this.options = options;

    if (this.options?.netlifyConfiguration?.enabled) {
      new TomlFile(project, 'netlify.toml', { obj: () => this.synthNetlifyConfiguration() });
    }
  }

  private synthNetlifyConfiguration() {
    return resolve({
      build: {
        publish: this.options?.netlifyConfiguration?.buildOptions?.publish ?? this.options?.hugoConfiguration?.publishDir ?? 'public',
        command: this.options?.netlifyConfiguration?.buildOptions?.command ?? 'hugo -v -gc --minify',
      },
    }, { omitEmpty: true });
  }
}