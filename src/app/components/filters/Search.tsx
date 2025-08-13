import { InputAdornment, TextField, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchProps = {
  parametrosDeBusca: string;
  setParametrosDeBusca: React.Dispatch<React.SetStateAction<string>>;
};

export const Search: React.FC<SearchProps> = ({
  parametrosDeBusca,
  setParametrosDeBusca,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <TextField
      label="Pesquisar"
      fullWidth
      size={isMobile ? "small" : "medium"}
      sx={{
        my: isMobile ? 1 : 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          maxHeight: isMobile ? "42px" : "48px",
        },
        maxWidth: isMobile ? "100%" : "492px",
        width: "100%",
      }}
      value={parametrosDeBusca}
      onChange={(event) => setParametrosDeBusca(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize={isMobile ? "small" : "medium"} />
          </InputAdornment>
        ),
      }}
    />
  );
};
