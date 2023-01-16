const { cdk, github } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const project = new cdk.JsiiProject({
  author: 'Jesse Grabowski',
  authorAddress: 'npm@jessegrabowski.com',
  defaultReleaseBranch: 'main',
  name: '@npm-jessegrabowski/projen-hugo',
  repositoryUrl: 'https://github.com/github/projen-hugo.git',
  description: 'A projen project for building a Hugo site.',
  npmAccess: NpmAccess.PUBLIC,
  gitignore: ['.idea'],
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp({}),
  },
  deps: ['projen'],
  peerDeps: ['projen'],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();