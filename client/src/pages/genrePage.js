import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { useEffect, useState } from "react";
import axios from "axios";
import "./GenreAnimes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const columns = [
  {
    id: "title_screen",
    label: "Thumbnail",
    minWidth: 170,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "anime_id",
    label: "Id",
    minWidth: 100,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "number_of_episodes",
    label: "Total episodes",
    minWidth: 170,
    align: "center",
    format: (value) => value.toFixed(0),
  },
  {
    id: "anime_name",
    label: "Title",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "anime_type",
    label: "Type",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "age_rating",
    label: "Age_rating",
    minWidth: 170,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "season",
    label: "Season",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "year",
    label: "Year",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(0),
  },
  {
    id: "mal_score",
    label: "Mal_score",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

export default function GenrePage({ id, name }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState([]);

  
  const [filteredAnimeList, setFilteredAnimeList] = useState([]);

  useEffect(() => {
    // console.log("Genre ID:", id);
    axios
      .get(`http://localhost:3000/genre/${id}`)
      .then((res) => {
        // console.log(res.data);
        setAnimeList(res.data);
        setFilteredAnimeList(res.data);
        setLoading(false);
        // console.log(animeList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [searchTerm, setSearchTerm] = useState("");
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterAnimeList(event.target.value);

    console.log("Search Term:", searchTerm);
    console.log(filteredAnimeList);
  };

  const filterAnimeList = (searchQuery) => {
    const filteredData = animeList.filter((anime) =>
      anime.anime_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAnimeList(filteredData);
  };
  
  const [searchTermType, setSearchTermType] = useState("");
  
  const handleSearchTypeChange = (event) => {
    setSearchTermType(event.target.value);
    filterAnimeListByType(event.target.value);

    console.log("Search Term:", searchTermType);
    console.log(filteredAnimeList);
  };

  const filterAnimeListByType = (searchQuery) => {
    const filteredData = animeList.filter((anime) =>
      anime.anime_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAnimeList(filteredData);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <input
          type="text"
          placeholder="Search by type..."
          value={searchTermType}
          onChange={handleSearchTypeChange}
        />
        {/* <button type="submit" onClick={handleSearchChange}>
          aa
        </button> */}
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={9}>
                <Link
                  // to={`http://localhost:3001/genre/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h1>{name}</h1>
                </Link>
              </TableCell>
              {/* <TableCell align="center" colSpan={3}>
                Details
              </TableCell> */}
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnimeList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((anime) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={anime.id}>
                    {columns.map((column) => {
                      const value = anime[column.id];
                      // console.log(`${column.id}:`, value);
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "title_screen" ? (
                            <Link
                              to={`http://localhost:3001/watch/anime/episodes/${anime.anime_id}`}
                              className="list-group-item d-flex align-items-center"
                              // onClick={() => {
                              //   console.log("Anime ID:", anime.anime_id);
                              // }}
                            >
                              <img
                                src={value}
                                alt="Title Screen"
                                style={{ maxWidth: "50px", maxHeight: "75px" }}
                              />
                            </Link>
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100, 500]}
        component="div"
        count={filteredAnimeList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
