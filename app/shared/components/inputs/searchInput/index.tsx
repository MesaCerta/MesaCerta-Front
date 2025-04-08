import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { IDishData, IRestaurantData } from "@/app/shared/@types";
import styles from "./search.module.scss";

interface SearchProps {
  onSearchChange: (searchTerm: string) => void;
  search: (IRestaurantData | IDishData)[];
  searchType?: "restaurant" | "dish" | "both";
}

export default function Search({ onSearchChange, search, searchType = "both" }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const getPlaceholder = () => {
    switch (searchType) {
      case "restaurant":
        return "Busque por restaurantes";
      case "dish":
        return "Busque por pratos";
      default:
        return "Busque por pratos ou restaurantes";
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value !== null) {
      setInputValue(value);
      onSearchChange(value);
    }
  };

  const handleSelectionChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value !== null) {
      const selectedSearch = search.find((searchs) => searchs.name === value);
      if (selectedSearch) {
        const type = (selectedSearch as IRestaurantData).address
          ? "restaurant"
          : "dish";
        router.push(`/${type}/${selectedSearch.id}`);
      }
    }
  };

  return (
    <div className={styles.searchSection}>
      <Autocomplete
        freeSolo
        options={search.map((searchs) => searchs.name)}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              value: inputValue,
              placeholder: getPlaceholder(),
              sx: {
                "&::placeholder": {
                  opacity: inputValue ? 0 : 1,
                },
                "& fieldset": { border: "none" },
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
            className={styles.searchInput}
          />
        )}
      />
    </div>
  );
}
