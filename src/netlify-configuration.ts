import { Component, Project, TomlFile } from 'projen';
import { resolve } from 'projen/lib/_resolve';
import { arrayOfAll } from './helpers';
import { HugoProjectOptions } from './hugo-project';

export interface NetlifyContentSecurityPolicyConfiguration {
  readonly baseUri?: string[];
  readonly childSrc?: string[];
  readonly connectSrc?: string[];
  readonly defaultSrc?: string[];
  readonly fontSrc?: string[];
  readonly formAction?: string[];
  readonly frameAncestors?: string[];
  readonly frameSrc?: string[];
  readonly imgSrc?: string[];
  readonly manifestSrc?: string[];
  readonly mediaSrc?: string[];
  readonly objectSrc?: string[];
  readonly prefetchSrc?: string[];
  readonly sandbox?: string[];
  readonly scriptSrc?: string[];
  readonly scriptSrcAttr?: string[];
  readonly scriptSrcElem?: string[];
  readonly styleSrc?: string[];
  readonly styleSrcAttr?: string[];
  readonly styleSrcElem?: string[];
  readonly workerSrc?: string[];
}

const netlifyContentSecurityPolicyConfigurationKeys = arrayOfAll<keyof NetlifyContentSecurityPolicyConfiguration>()(
  'defaultSrc',
  'baseUri',
  'childSrc',
  'connectSrc',
  'fontSrc',
  'formAction',
  'frameAncestors',
  'frameSrc',
  'imgSrc',
  'manifestSrc',
  'mediaSrc',
  'objectSrc',
  'prefetchSrc',
  'sandbox',
  'scriptSrc',
  'scriptSrcAttr',
  'scriptSrcElem',
  'styleSrc',
  'styleSrcAttr',
  'styleSrcElem',
  'workerSrc',
);

export interface NetlifyPermissionsPolicyConfiguration {
  readonly accelerometer?: string[];
  readonly ambientLightSensor?: string[];
  readonly autoplay?: string[];
  readonly battery?: string[];
  readonly camera?: string[];
  readonly displayCapture?: string[];
  readonly documentDomain?: string[];
  readonly encryptedMedia?: string[];
  readonly executionWhileNotRendered?: string[];
  readonly executionWhileOutOfViewport?: string[];
  readonly fullscreen?: string[];
  readonly gamepad?: string[];
  readonly geolocation?: string[];
  readonly gyroscope?: string[];
  readonly hid?: string[];
  readonly idleDetection?: string[];
  readonly localFonts?: string[];
  readonly magnetometer?: string[];
  readonly microphone?: string[];
  readonly midi?: string[];
  readonly payment?: string[];
  readonly pictureInPicture?: string[];
  readonly publickeyCredentialsGet?: string[];
  readonly screenWakeLock?: string[];
  readonly serial?: string[];
  readonly speakerSelection?: string[];
  readonly usb?: string[];
  readonly webShare?: string[];
  readonly xrSpatialTracking?: string[];
}

const netlifyPermissionsPolicyConfigurationKeys = arrayOfAll<keyof NetlifyPermissionsPolicyConfiguration>()(
  'accelerometer',
  'ambientLightSensor',
  'autoplay',
  'battery',
  'camera',
  'displayCapture',
  'documentDomain',
  'encryptedMedia',
  'executionWhileNotRendered',
  'executionWhileOutOfViewport',
  'fullscreen',
  'gamepad',
  'geolocation',
  'gyroscope',
  'hid',
  'idleDetection',
  'localFonts',
  'magnetometer',
  'microphone',
  'midi',
  'payment',
  'pictureInPicture',
  'publickeyCredentialsGet',
  'screenWakeLock',
  'serial',
  'speakerSelection',
  'usb',
  'webShare',
  'xrSpatialTracking',
);

export interface NetlifyCustomHeadersConfiguration {
  readonly [key: string]: string;
}

export interface NetlifyHeaderValuesConfiguration {
  readonly permissionsPolicy: NetlifyPermissionsPolicyConfiguration;
  readonly contentSecurityPolicy: NetlifyContentSecurityPolicyConfiguration;
  readonly customHeaders?: NetlifyCustomHeadersConfiguration;
}

export interface NetlifyHeadersConfiguration {
  readonly [key: string]: NetlifyHeaderValuesConfiguration;
}

export interface NetlifyBuildEnvironmentConfiguration {
  readonly [key: string]: string;
}

export interface NetlifyBuildConfiguration {
  readonly publish: string;
  readonly command: string;
  readonly environment: NetlifyBuildEnvironmentConfiguration;
}

export interface NetlifyConfiguration {
  readonly enabled: boolean;
  readonly buildOptions?: NetlifyBuildConfiguration;
  readonly headers?: NetlifyHeadersConfiguration;
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
        environment: this.options?.netlifyConfiguration?.buildOptions?.environment ?? {},
      },
      headers: this.synthHeaders(),
    }, { omitEmpty: true });
  }

  private synthHeaders() {
    const defaultHeaders = {
      permissionsPolicy: {},
      contentSecurityPolicy: this.synthDefaultContentSecurityPolicy(),
      customHeaders: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    };

    if (typeof this.options?.netlifyConfiguration?.headers === 'undefined') {
      return [this.synthHeadersForPath('/*', defaultHeaders)];
    }

    let headers = [];
    if (typeof this.options.netlifyConfiguration.headers['/*'] === 'undefined') {
      headers.push(this.synthHeadersForPath('/*', defaultHeaders));
    }
    Object.keys(this.options.netlifyConfiguration.headers)
      .forEach(path => headers.push(this.synthHeadersForPath(path, this.options?.netlifyConfiguration?.headers?.[path] ?? defaultHeaders)));

    return headers;
  }

  private synthHeadersForPath(path: string, headers: NetlifyHeaderValuesConfiguration) {
    return {
      for: path,
      values: {
        'Permissions-Policy': this.synthPermissionsPolicy(headers.permissionsPolicy ?? {}),
        'Content-Security-Policy': this.synthContentSecurityPolicy(headers.contentSecurityPolicy ?? {}),
        ...headers.customHeaders,
      },
    };
  }

  private synthPermissionsPolicy(policy: NetlifyPermissionsPolicyConfiguration) {
    return netlifyPermissionsPolicyConfigurationKeys.map(key => {
      const value = policy[key] ?? [];
      return `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}=(${value.map(this.synthPermissionsPolicyValue).join(' ')})`;
    }).join(', ');
  }

  private synthPermissionsPolicyValue(value: string) {
    switch (value) {
      case 'self':
      case 'src':
        return value;
      default:
        return `"${value}"`;
    }
  }

  private synthDefaultContentSecurityPolicy() {
    let imgSrc = ['self', 'data:'];
    if (typeof this.options?.cloudinaryConfiguration?.cloudName !== 'undefined') {
      imgSrc.push(`https://res.cloudinary.com/${this.options.cloudinaryConfiguration.cloudName}/`);
    }
    return {
      defaultSrc: ['self'],
      imgSrc: imgSrc,
      objectSrc: ['none'],
    };
  }

  private synthContentSecurityPolicy(policy: NetlifyContentSecurityPolicyConfiguration) {
    return netlifyContentSecurityPolicyConfigurationKeys.filter(key => policy[key]?.length ?? 0 > 0).map(key => {
      const value = policy[key] ?? [];
      return `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()} ${value.map(this.synthContentSecurityPolicyValue).join(' ')}`;
    }).join('; ');
  }

  private synthContentSecurityPolicyValue(value: string) {
    switch (value) {
      case 'self':
      case 'unsafe-eval':
      case 'wasm-unsafe-eval':
      case 'unsafe-hashes':
      case 'unsafe-inline':
      case 'none':
      case 'strict-dynamic':
      case 'report-sample':
        return `'${value}'`;
      default:
        if (value.startsWith('nonce-') || value.startsWith('sha256-') || value.startsWith('sha384-') || value.startsWith('sha512-')) {
          return `'${value}'`;
        } else {
          return value;
        }
    }
  }
}