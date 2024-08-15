export type orderByOptions =
  | 'alphabetical_a_z'
  | 'alphabetical_z_a'
  | 'newest'
  | 'oldest';

export function buildOrderClause(orderByOption: orderByOptions) {
  const orderMapping: Record<
    orderByOptions,
    { field: string; direction: 'asc' | 'desc' }
  > = {
    alphabetical_a_z: { field: 'book', direction: 'asc' },
    alphabetical_z_a: { field: 'book', direction: 'desc' },
    newest: { field: 'createdAt', direction: 'desc' },
    oldest: { field: 'createdAt', direction: 'asc' },
  };

  const { field, direction } = orderMapping[orderByOption] || {};
  return field ? { [field]: direction } : {};
}
