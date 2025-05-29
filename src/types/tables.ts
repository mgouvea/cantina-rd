export interface TabelaProps<T extends object> {
  data: T[] | undefined;
  isLoading: boolean;
  handleEditClick: (row: T) => () => void;
  handleDeleteClick: (row: T) => () => void;
}
