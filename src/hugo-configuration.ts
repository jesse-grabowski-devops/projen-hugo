import { Component, Project, TomlFile } from 'projen';
import { resolve } from 'projen/lib/_resolve';

export interface HugoBuildConfiguration {
  readonly noJSConfigInAssets?: boolean;
  readonly useResourceCacheWhen?: string;
  readonly writeStats?: boolean;
}

export interface HugoCachesConfiguration {
  readonly [key: string]: HugoCacheConfiguration;
}

export interface HugoCacheConfiguration {
  readonly dir: string;
  readonly maxAge: number;
}

export interface HugoImagingConfiguration {
  readonly anchor?: string;
  readonly bgColor?: string;
  readonly hint?: string;
  readonly quality?: number;
  readonly resampleFilter?: string;
}

export interface HugoLanguagesConfiguration {
  readonly [key: string]: HugoLanguageConfiguration;
}

export interface HugoLanguageConfiguration {
  readonly languagedirection?: string;
  readonly title: string;
  readonly weight: number;
  readonly params?: any;
}

export interface HugoMediaTypesConfiguration {
  readonly [key: string]: HugoMediaTypeConfiguration;
}

export interface HugoMediaTypeConfiguration {
  readonly suffixes?: string[];
}

export interface HugoModuleConfiguration {
  readonly noProxy?: string;
  readonly noVendor?: string;
  readonly private?: string;
  readonly proxy?: string;
  readonly replacements?: string;
  readonly workspace?: string;
}

export interface HugoOutputFormatsConfiguration {
  readonly [key: string]: HugoOutputFormatConfiguration;
}

export interface HugoOutputFormatConfiguration {
  readonly name?: string;
  readonly mediaType?: string;
  readonly path?: string;
  readonly baseName?: string;
  readonly rel?: string;
  readonly protocol?: string;
  readonly isPlainText?: boolean;
  readonly isHTML?: boolean;
  readonly noUgly?: boolean;
  readonly notAlternative?: boolean;
  readonly permalinkable?: boolean;
  readonly weight?: number;
}

export interface HugoPermalinksConfiguration {
  readonly [key: string]: string;
}

export interface HugoSitemapConfiguration {
  readonly changefreq?: string;
  readonly filename?: string;
  readonly priority?: number;
}

export interface HugoTaxonomiesConfiguration {
  readonly [key: string]: string;
}

export interface HugoOutputsConfiguration {
  readonly [key: string]: string[];
}

export interface HugoParamsConfiguration {
  readonly [key: string]: any;
}

export interface HugoConfiguration {
  readonly archetypeDir?: string;
  readonly assetDir?: string;
  readonly baseURL: string;
  readonly buildOptions?: HugoBuildConfiguration;
  readonly buildDrafts?: boolean;
  readonly buildExpired?: boolean;
  readonly buildFuture?: boolean;
  readonly caches?: HugoCachesConfiguration;
  readonly cascade?: any[];
  readonly canonifyURLs?: boolean;
  readonly cleanDestinationDir?: boolean;
  readonly contentDir?: string;
  readonly copyright?: string;
  readonly dataDir?: string;
  readonly defaultContentLanguage?: string;
  readonly defaultContentLanguageInSubdir?: boolean;
  readonly disableAliases?: boolean;
  readonly disableHugoGeneratorInject?: boolean;
  readonly disableKinds?: string[];
  readonly disableLiveReload?: boolean;
  readonly disablePathToLower?: boolean;
  readonly enableEmoji?: boolean;
  readonly enableGitInfo?: boolean;
  readonly enableInlineShortcodes?: boolean;
  readonly enableMissingTranslationPlaceholders?: boolean;
  readonly enableRobotsTXT?: boolean;
  readonly frontmatter?: any;
  readonly googleAnalytics?: string;
  readonly hasCJKLanguage?: boolean;
  readonly imaging?: HugoImagingConfiguration;
  readonly languageCode: string;
  readonly languages?: HugoLanguagesConfiguration;
  readonly disableLanguages?: string[];
  readonly markup?: any;
  readonly mediaTypes?: HugoMediaTypesConfiguration;
  readonly menu?: any;
  readonly minify?: any;
  readonly module?: HugoModuleConfiguration;
  readonly newContentEditor?: string;
  readonly noChmod?: boolean;
  readonly noTimes?: boolean;
  readonly outputs?: HugoOutputsConfiguration;
  readonly outputFormats?: HugoOutputFormatsConfiguration;
  readonly paginate?: number;
  readonly paginatePath?: number;
  readonly params?: HugoParamsConfiguration;
  readonly permalinks?: HugoPermalinksConfiguration;
  readonly pluralizeListTitles?: boolean;
  readonly publishDir?: string;
  readonly related?: any;
  readonly relativeURLs?: boolean;
  readonly refLinksErrorLevel?: string;
  readonly refLinksNotFoundURL?: string;
  readonly removePathAccents?: boolean;
  readonly rssLimit?: number;
  readonly sectionPagesMenu?: string;
  readonly security?: any;
  readonly sitemap?: HugoSitemapConfiguration;
  readonly summaryLength?: number;
  readonly taxonomies?: HugoTaxonomiesConfiguration;
  readonly theme: string;
  readonly themesDir?: string;
  readonly timeout?: string;
  readonly timeZone?: string;
  readonly title: string;
  readonly titleCaseStyle?: string;
  readonly uglyURLs?: boolean;
  readonly watch?: boolean;
}

export class Site extends Component {
  constructor(project: Project, options: HugoConfiguration) {
    super(project);

    new TomlFile(project, 'config.toml', { obj: () => resolve(options, { omitEmpty: true }) });
  }

  private synthSiteConfig(options: HugoConfiguration) {
    // Circumvent JSII5016
    const { buildOptions, ...remainder } = options;

    return resolve({
      ...remainder,
      build: buildOptions,
    },
    { omitEmpty: true });
  }
}