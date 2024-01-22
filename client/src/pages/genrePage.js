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
import { useParams } from "react-router-dom";
import "./GenreAnimes.css";
import "bootstrap/dist/css/bootstrap.min.css";

const columns = [
  {
    id: "title_screen",
    label: "Thumbnail",
    minWidth: 170,
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "anime_id", label: "Id", minWidth: 100,format: (value) => value.toLocaleString("en-US"), },
  //   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: "number_of_episodes",
    label: "Total episodes",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(0),
  },
  {
    id: "anime_type",
    label: "Type",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "age_rating",
    label: "Age_rating",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "season",
    label: "Season",
    minWidth: 170,
    align: "right",
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

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function GenrePage({ id, name }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    console.log("Genre ID:", id);
    axios
      .get(`http://localhost:3000/genre/${id}`)
      .then((res) => {
        console.log(res.data);
        setAnimeList(res.data);
        setLoading(false);
        console.log(animeList);
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

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={8}>
                <a href={`http://localhost:3001/genre/${id}`}>
                  <h1>{name}</h1>
                </a>
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
            {animeList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((anime) => {
                return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={anime.id}>
                    {columns.map((column) => {
                        const value = anime[column.id];
                        console.log(`${column.id}:`, value);
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'title_screen' ? (
                            <img src={value} alt="Title Screen" style={{ maxWidth: '50px', maxHeight: '75px' }} />
                          ) : (
                            column.format && typeof value === 'number' ? column.format(value) : value
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={animeList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
