import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect({
  options,
  displayValue,
  onSelect,
  onRemove,
  selectedValues,
  placeholder,
}) {
  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) =>
          selected
            .map(
              (id) => options.find((option) => option.id === id)[displayValue]
            )
            .join(", ")
        }
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <Checkbox checked={selectedValues.indexOf(option.id) > -1} />
            <ListItemText primary={option[displayValue]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
