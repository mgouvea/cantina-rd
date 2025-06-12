import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { GroupFamily } from "@/types";

export default function SelectFamilies({
  families,
}: {
  families: GroupFamily[];
}) {
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={families}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label="Família" placeholder="Família" />
        )}
      />
    </Stack>
  );
}
