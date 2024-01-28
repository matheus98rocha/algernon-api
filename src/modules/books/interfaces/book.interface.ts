export enum EnumBookStatus {
  READING_NOW = 'readingNow',
  IS_READED = 'isReaded',
  WANT_TO_READ = 'wantToRead',
}
export interface IBook {
  name: string;
  author: string;
  status: EnumBookStatus;
}
