export type orderByOptions =
  | 'alphabetical_a_z'
  | 'alphabetical_z_a'
  | 'newest'
  | 'oldest'
  | 'most_rated'
  | 'least_rated';

export function buildOrderClause(orderByOption: orderByOptions) {
  const orderMapping: Record<
    orderByOptions,
    { field: string; direction: 'asc' | 'desc' }
  > = {
    alphabetical_a_z: { field: 'book', direction: 'asc' },
    alphabetical_z_a: { field: 'book', direction: 'desc' },
    newest: { field: 'createdAt', direction: 'desc' },
    oldest: { field: 'createdAt', direction: 'asc' },
    most_rated: { field: 'rate', direction: 'desc' },
    least_rated: { field: 'rate', direction: 'asc' },
  };

  const { field, direction } = orderMapping[orderByOption] || {};
  return field ? { [field]: direction } : {};
}
