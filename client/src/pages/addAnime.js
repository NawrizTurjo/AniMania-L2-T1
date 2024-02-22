import axios from "axios";
import React, { useEffect, useState } from "react";
import MultiSelect from "multiselect-react-dropdown";
import { Select, MenuItem, TextField, Input } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MultipleSelect from "../Components/multipleSelect";

export default function AddAnime() {
  const [currentSeasons, setCurrentSeasons] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [year, setYear] = useState("");
  const [types, setTypes] = useState([]);
  const [demographic, setDemographic] = useState("");
  const [source, setSource] = useState([]);
  const [episodes, setEpisodes] = useState("");
  const [characters, setCharacters] = useState("");
  const [image, setImage] = useState("");

  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAgeRating, setSelectedAgeRating] = useState("");
  const [selectedDemographic, setSelectedDemographic] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);

  const onSelect = (selectedList, selectedItem) => {
    setSelectedSeasons(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedSeasons(selectedList);
  };

  const onSelectGenres = (selectedList, selectedItem) => {
    setSelectedGenres(selectedList);
  };

  const onRemoveGenres = (selectedList, removedItem) => {
    setSelectedGenres(selectedList);
  };

  const onSelectDemo = (selectedList, selectedItem) => {
    setSelectedDemographic(selectedList);
  };

  const onRemoveDemo = (selectedList, removedItem) => {
    setSelectedDemographic(selectedList);
  };

  const onSelectType = (selectedList, selectedItem) => {
    setSelectedType(selectedList);
  };

  const onRemoveType = (selectedList, removedItem) => {
    setSelectedType(selectedList);
  };

  const onSelectSource = (selectedList, selectedItem) => {
    setSelectedSource(selectedList);
  };

  const onRemoveSource = (selectedList, removedItem) => {
    setSelectedSource(selectedList);
  };

  const onSelectTags = (selectedList, selectedItem) => {
    setSelectedTags(selectedList);
  };

  const onRemoveTags = (selectedList, removedItem) => {
    setSelectedTags(selectedList);
  };

  const handleAgeRatingChange = (e) => {
    setSelectedAgeRating(e.target.value);
  };

  const seasonsOptions = [
    { name: "summer", id: 1 },
    { name: "fall", id: 2 },
    { name: "winter", id: 3 },
    { name: "spring", id: 4 },
  ];
  const ageRatingOptions = [
    "PG - Children",
    "PG-13 - Teens 13 or older",
    "R - 17+ (violence & profanity)",
    "R+ - Mild Nudity",
    "Rx - Hentai",
    "G - All Ages",
  ];

  const dempgraphicOptions = [
    { name: "Shounen", id: 1 },
    { name: "Shoujo", id: 2 },
    { name: "Josei", id: 3 },
    { name: "Seinen", id: 4 },
    { name: "Kids", id: 5 },
  ];

  const typeOptions = [
    { name: "TV", id: 1 },
    { name: "Special", id: 2 },
    { name: "ONA", id: 3 },
    { name: "Music", id: 4 },
    { name: "Movie", id: 5 },
    { name: "TV Special", id: 6 },
    { name: "OVA", id: 7 },
  ];

  const userEmail = localStorage.getItem("email");

  async function getGenres() {
    try {
      setLoadingGenres(true);
      const res = await axios.get(`http://localhost:3000/genre`);
      setGenres(res.data);
      setLoadingGenres(false);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getTags() {
    try {
      setLoadingTags(true);
      const res = await axios.get(`http://localhost:3000/tags`);
      setTags(res.data);
      setLoadingTags(false);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getSources() {
    try {
      setLoadingSources(true);
      const res = await axios.get(`http://localhost:3000/source`);
      setSource(res.data);
      setLoadingSources(false);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddAnime = (e) => {
    e.preventDefault();
    console.log(selectedDemographic);
    console.log(selectedType);
    console.log("Add Anime");
  };

  useEffect(() => {
    getGenres();
    getTags();
    getSources();
  }, []);

  if (loadingGenres || loadingTags || loadingSources) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form className="mt-20">
        <input className="form-control" type="text" placeholder="Title" />
        <label htmlFor="ageRating">Select Age Rating</label>
        <Select
          className="mt-2"
          id="ageRating"
          value={selectedAgeRating}
          label="Select Age Rating"
          onChange={handleAgeRatingChange}
          fullWidth
        >
          {ageRatingOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <div className="mt-2">
          <TextField
            id="image"
            label="Image"
            placeholder="Image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>
        <div className="mt-2">
          <TextField
            id="outlined-number"
            label="Total Episodes"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div>
          <MultiSelect
            options={genres}
            displayValue="genre_name"
            onSelect={onSelectGenres}
            onRemove={onRemoveGenres}
            selectedValues={selectedGenres}
            placeholder="Select Genres"
          />
          <br />
          <br />
        </div>

        <TextField
          multiline
          rows={4}
          variant="outlined"
          label="Description"
          placeholder="Description"
          fullWidth
        />
        <div>
          <MultiSelect
            options={typeOptions}
            displayValue="name"
            onSelect={onSelectType}
            onRemove={onRemoveType}
            selectedValues={selectedType}
            placeholder="Select Type"
          />
          <br />
          <br />
        </div>
        <div>
          <MultiSelect
            options={seasonsOptions}
            displayValue="name"
            onSelect={onSelect}
            onRemove={onRemove}
            selectedValues={selectedSeasons}
            placeholder="Select Seasons"
          />
          <br />
          <br />
        </div>
        <TextField
          type="number"
          label="Year"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <TextField type="text" label="Studio" placeholder="Studio" />
        <TextField type="text" label="Duration" placeholder="Duration" />
        <div>
          <MultiSelect
            options={dempgraphicOptions}
            displayValue="name"
            onSelect={onSelectDemo}
            onRemove={onRemoveDemo}
            selectedValues={selectedDemographic}
            placeholder="Select Demographic"
          />
          <br />
          <br />
        </div>
        <div>
          <MultiSelect
            options={tags}
            displayValue="tag_name"
            onSelect={onSelectTags}
            onRemove={onRemoveTags}
            selectedValues={selectedTags}
            placeholder="Select Tags"
          />
          <br />
          <br />
        </div>
        <MultiSelect
          options={source}
          displayValue="anime_source"
          onSelect={onSelectSource}
          onRemove={onRemoveSource}
          selectedValues={selectedSource}
          placeholder="Select Source"
        />
        <br />
        <br />
        <div className="row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Opening" />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Opening Band"
            />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="Ending" />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Ending Band"
            />
          </div>
        </div>
        <input
          className="form-control"
          type="text"
          placeholder="Streaming Sites"
        />
        <div className="form-row">
          <div className="form-group col">
            <input
              type="text"
              className="form-control"
              placeholder="Director"
            />
          </div>
          <div className="form-group col">
            <input type="text" className="form-control" placeholder="Writer" />
          </div>
          <div className="form-group col">
            <input
              type="text"
              className="form-control"
              placeholder="Producers"
            />
          </div>
          <div className="form-group col">
            <input
              type="number"
              className="form-control"
              placeholder="Mal Score"
            />
          </div>
        </div>

        <button type="submit" onClick={handleAddAnime}>
          Add Anime
        </button>
      </form>
    </>
  );
}
