import { Component, TextFile } from 'projen';
import { HugoProject, HugoProjectOptions } from './hugo-project';

export interface PurgecssConfiguration {
  readonly enabled?: boolean;
  readonly safelist?: string[];
}

export interface AutoprefixerConfiguration {
  readonly enabled?: boolean;
}

export interface PostcssConfiguration {
  readonly enabled?: boolean;
  readonly autoprefixer?: AutoprefixerConfiguration;
  readonly purgecss?: PurgecssConfiguration;
}

export class PostCSS extends Component {
  public readonly options: HugoProjectOptions;

  constructor(project: HugoProject, options: HugoProjectOptions) {
    super(project);
    this.options = options;

    if (this.options?.postcssConfiguration?.enabled ?? false) {
      let constants: string[] = [];
      let plugins: string[] = [];
      let deps: string[] = ['postcss-cli', 'postcss'];

      if (this.options?.postcssConfiguration?.autoprefixer?.enabled ?? false) {
        this.synthAutoprefixer(constants, plugins, deps);
      }

      if (this.options?.postcssConfiguration?.purgecss?.enabled ?? false) {
        this.synthPurgecss(constants, plugins, deps);
      }

      new TextFile(project, 'postcss.config.js', {
        lines: [
          ...constants,
          'module.exports = {',
          '  plugins: [',
          ...plugins,
          '  ]',
          '};',
        ],
      });
      project.addDeps(...deps);
    }
  }

  private synthAutoprefixer(constants: string[], plugins: string[], deps: string[]) {
    deps.push('autoprefixer');

    constants.push('const autoprefixer = require("autoprefixer")({});');
    plugins.push('autoprefixer,');
  }

  private synthPurgecss(constants: string[], plugins: string[], deps: string[]) {
    deps.push('@fullhuman/postcss-purgecss');

    constants.push(`
        const purgecss = require("@fullhuman/postcss-purgecss")({
            content: ['./hugo_stats.json'],
            defaultExtractor: (content) => {
                let els = JSON.parse(content).htmlElements;
                return els.tags.concat(els.classes, els.ids);
            },
            safelist: ${JSON.stringify(this.options?.postcssConfiguration?.purgecss?.safelist ?? [])},
        });`);

    plugins.push('...(process.env.HUGO_ENVIRONMENT === \'production\' ? [purgecss] : []),');
  }
}