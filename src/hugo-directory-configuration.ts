import { Component, Project, TextFile } from 'projen';
import { HugoProjectOptions } from './hugo-project';

export class SiteDirectories extends Component {
  public readonly options: HugoProjectOptions;

  constructor(project: Project, options: HugoProjectOptions) {
    super(project);
    this.options = options;

    project.addGitIgnore('/public/');
    project.addGitIgnore('/resources/_gen/');
    project.addGitIgnore('/assets/jsconfig.json');
    project.addGitIgnore('hugo_stats.json');
    project.addGitIgnore('/.hugo_build.lock');

    new TextFile(project, 'archetypes/.gitkeep', { marker: false });
    new TextFile(project, 'assets/.gitkeep', { marker: false });
    new TextFile(project, 'layouts/.gitkeep', { marker: false });
    new TextFile(project, 'data/.gitkeep', { marker: false });
    new TextFile(project, 'static/.gitkeep', { marker: false });
    new TextFile(project, 'themes/.gitkeep', { marker: false });
    new TextFile(project, 'content/.gitkeep', { marker: false });

    Object.entries(this.options?.hugoConfiguration?.languages ?? {}).forEach(([_, value]) => {
      if (typeof value.contentDir !== 'undefined') {
        new TextFile(project, `${value.contentDir}/.gitkeep`, { marker: false });
      }
    });
  }
}