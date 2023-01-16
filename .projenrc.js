const { cdk } = require('projen');
const project = new cdk.JsiiProject({
  author: 'Jesse Grabowski',
  authorAddress: 'github@jessegrabowski.com',
  defaultReleaseBranch: 'main',
  name: 'projen-hugo',
  repositoryUrl: 'https://github.com/github/projen-hugo.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();