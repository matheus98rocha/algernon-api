export type WhereClauseType = {
  userId: number;
  status?: string;
  isFavorite?: boolean;
  book?: {
    contains: string;
    mode: 'insensitive';
  };
};

export function buildWhereClause(
  userId: number,
  status?: string,
  bookName?: string,
  isFavorite?: boolean,
): WhereClauseType {
  const whereClause: WhereClauseType = { userId };

  if (status) {
    whereClause.status = status;
  }

  if (isFavorite) {
    whereClause.isFavorite = Boolean(isFavorite);
  }

  if (bookName) {
    whereClause.book = {
      contains: bookName,
      mode: 'insensitive',
    };
  }

  return whereClause;
}
