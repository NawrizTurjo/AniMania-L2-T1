import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const MaterialPagination = ({
  animePerPage,
  totalAnimes,
  paginate,
  toggleRerender,
}) => {
  const pageCount = Math.ceil(totalAnimes / animePerPage);

  const handleChange = (event, value) => {
    paginate(value);
    window.scrollTo(0, 0);
    toggleRerender();
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Stack spacing={2}>
        <Pagination count={pageCount} color="primary" onChange={handleChange} />
      </Stack>
    </div>
  );
};

export default MaterialPagination;
