export interface TabelaProps<T extends object> {
  data: T[];
  isLoading: boolean;
  handleEditClick: (row: T) => () => void;
  handleDeleteClick: (id: string) => () => void;
}
