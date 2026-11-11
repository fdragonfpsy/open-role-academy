/** Single place for the project name and global site settings. */
export const site = {
  name: 'Open Role Academy',
  repoUrl: 'https://github.com/fdragonfpsy/open-role-academy',
  codeLicense: { id: 'MIT', url: 'https://opensource.org/license/mit' },
  contentLicense: { id: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
} as const;

export const languages = ['en', 'de'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'en';
