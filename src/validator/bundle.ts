/** Raw content as read from disk, before validation. `file` is a repo-relative path for messages. */
export interface RawFile {
  file: string;
  data: unknown;
}

export interface RawUnit extends RawFile {
  lang: 'en' | 'de';
  /** File name without extension, e.g. `information-security-basics-foundation`. */
  name: string;
  body: string;
}

export interface ContentBundle {
  roles: RawFile[];
  competencies: RawFile[];
  units: RawUnit[];
  items: RawFile[];
  resources: RawFile[];
}

export interface Issue {
  level: 'error' | 'warning';
  file: string;
  message: string;
}
