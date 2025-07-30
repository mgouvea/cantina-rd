import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchProps = {
  parametrosDeBusca: string;
  setParametrosDeBusca: React.Dispatch<React.SetStateAction<string>>;
};

export const Search: React.FC<SearchProps> = ({
  parametrosDeBusca,
  setParametrosDeBusca,
}) => {
  return (
    <TextField
      label="Pesquisar"
      fullWidth
      sx={{
        my: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          maxHeight: "48px",
        },
        maxWidth: "492px",
      }}
      value={parametrosDeBusca}
      onChange={(event) => setParametrosDeBusca(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};
