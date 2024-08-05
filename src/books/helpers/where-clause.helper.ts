export type WhereClauseType = {
  userId: number;
  status?: string;
  book?: {
    contains: string;
    mode: 'insensitive';
  };
};

export function buildWhereClause(
  userId: number,
  status?: string,
  bookName?: string,
): WhereClauseType {
  const whereClause: WhereClauseType = { userId };

  if (status) {
    whereClause.status = status;
  }

  if (bookName) {
    whereClause.book = {
      contains: bookName,
      mode: 'insensitive',
    };
  }

  return whereClause;
}
