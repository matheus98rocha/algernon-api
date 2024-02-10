export enum EnumStatusBook {
  IS_READING = 'isReading',
  IS_READ = 'IsRead',
  WANT_TO_READ = 'wantToRead',
}

export interface IBook {
  id: string;
  title: string;
  author: string;
  status: EnumStatusBook;
  startedDate?: Date;
  endDate?: Date;
}
