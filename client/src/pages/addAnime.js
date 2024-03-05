import axios from "axios";
import React, { useEffect, useState } from "react";
import MultiSelect from "multiselect-react-dropdown";
import { Select, MenuItem, TextField, Input } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MultipleSelect from "../Components/multipleSelect";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

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


  const [anime_name, set_anime_name] = useState("");
  const [total_episodes, set_total_episodes] = useState("");
  const [description, setDescription] = useState ("");
  const [opening_soundtrack, set_opening_soundtrack] = useState("");
  const [ending_soundtrack, set_ending_soundtrack] = useState("");
  const [streaming_sites, set_streaming_sites] = useState("");
  const [mal_score, set_mal_score] = useState("");



  const [selectedSeasons, setSelectedSeasons] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAgeRating, setSelectedAgeRating] = useState("");
  const [selectedDemographic, setSelectedDemographic] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);

  //const history = useHistory();

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

  // const onSelectDemo = (selectedList, selectedItem) => {
  //   setSelectedDemographic(selectedList);
  // };

  // const onRemoveDemo = (selectedList, removedItem) => {
  //   setSelectedDemographic(selectedList);
  // };

  // const onSelectType = (selectedList, selectedItem) => {
  //   setSelectedType(selectedList);
  // };

  // const onRemoveType = (selectedList, removedItem) => {
  //   setSelectedType(selectedList);
  // };

  // const onSelectSource = (selectedList, selectedItem) => {
  //   setSelectedSource(selectedList);
  // };

  // const onRemoveSource = (selectedList, removedItem) => {
  //   setSelectedSource(selectedList);
  // };

  const onSelectTags = (selectedList, selectedItem) => {
    setSelectedTags(selectedList);
  };

  const onRemoveTags = (selectedList, removedItem) => {
    setSelectedTags(selectedList);
  };

  const handleAgeRatingChange = (e) => {
    setSelectedAgeRating(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleDemoChange = (e) => {
    setSelectedDemographic(e.target.value);
  };

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  const handleSeasonChange = (e) => {
    setSelectedSeasons(e.target.value);
  };

  const seasonsOptions = [
    "summer",
    "fall",
    "winter",
    "spring",
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
    "Shounen",
    "Shoujo",
    "Josei",
    "Seinen",
    "Kids",
  ];

  const typeOptions = [
    "TV", 
    "Special", 
    "ONA",
    "Music",
    "Movie",
    "TV Special",
    "OVA",
  ];

  const sourceOptions = [
    "4-koma manga",
    "Music",
    "Book",
    "Novel",
    "Web novel",
    "Mixed media",
    "Visual novel",
    "Other",
    "Unknown",
    "Web manga",
    "Manga",
    "Light novel",
    "Picture book",
    "Game",
    "Card game",
    "Original",
    "Radio",
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

  const handleAddAnime = async(e) => {
    // e.preventDefault();
    // console.log(selectedDemographic);
    // console.log(selectedType);
    // console.log("Add Anime");
    e.preventDefault();
    //setLoading(true);
    //console.log("Search String: ", searchString);
    // console.log(
    //   "Seasons: ",
    //   selectedSeasons.map((item) => item.name).join(", ")
    // );
    console.log("Genres: ", selectedGenres);
    console.log("Year: ", year);
    console.log("Age Rating: ", selectedAgeRating);
    //console.log("Rating: ", rating);
    console.log("Types: ", selectedType);
    console.log("Demographic: ", selectedDemographic);
    console.log("Source: ", selectedSource);
    console.log("Episodes: ", episodes);
    console.log("Characters: ", characters);

    //const searchSeasons = selectedSeasons.map((item) => item.name).join(", ");
    const searchGenres = selectedGenres
      .map((item) => item.genre_name)
      .join(", ");
    //const searchTypes = selectedType.map((item) => item.name).join(", ");
    // const searchDemographic = selectedDemographic
    //   .map((item) => item.name)
    //   .join(", ");
    // const searchSource = selectedSource
    //   .map((item) => item.anime_source)
    //   .join(", ");
    const searchTags = selectedTags
    .map((item) => item.tag_name)
    .join(", ");

    const res = await axios.post(`http://localhost:3000/addAnime`, {
      anime_name: anime_name,
      title_screen: image,
      total_episodes: total_episodes,
      description: description,

     // searchString: searchString,
      season: selectedSeasons,
      genre: searchGenres,
      tag: searchTags,
      year: year,
      ageRating: selectedAgeRating,
      //rating: rating,
      type: selectedType,
      demographic: selectedDemographic,
      source: selectedSource,
      opening_soundtrack:opening_soundtrack,
      ending_soundtrack: ending_soundtrack,
      streaming_sites: streaming_sites,
      mal_score: mal_score,
      //episodeCount: episodes,
      //characters: characters,
      userEmail: userEmail,
    });
    // setAnimeList(res.data);
    // setIsAnime(true);
    // console.log(res.data);
    // setLoading(false);
    
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
        <input className="form-control" type="text" placeholder="Title" value={anime_name}
          onChange={(e) => set_anime_name(e.target.value)} />
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
            value={total_episodes}
            onChange={(e) => set_total_episodes(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          fullWidth
        />
        <div>
        <label htmlFor="Type">Select Type</label>
        <Select
          className="mt-2"
          id="Type"
          value={selectedType}
          label="Select Type"
          onChange={handleTypeChange}
          fullWidth
        >
          {typeOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        </div>
        <div>
        <label htmlFor="Season">Select Season</label>
        <Select
          className="mt-2"
          id="Season"
          value={selectedSeasons}
          label="Select Season"
          onChange={handleSeasonChange}
          fullWidth
        >
          {seasonsOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        </div>
        <TextField
          type="number"
          label="Year"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {/* <TextField type="text" label="Studio" placeholder="Studio" />
        <TextField type="text" label="Duration" placeholder="Duration" /> */}
        <label htmlFor="Demographic">Select Demographic</label>
         <Select
          className="mt-2"
          id="Demographic"
          value={selectedDemographic}
          label="Select Demographic"
          onChange={handleDemoChange}
          fullWidth
        >
          {dempgraphicOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
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
        <label htmlFor="Source">Select Source</label>
        <Select
          className="mt-2"
          id="source"
          value={selectedSource}
          label="Select Source"
          onChange={handleSourceChange}
          fullWidth
        >
          {sourceOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <br />
        <br />
        <div className="row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Opening Soundtrack" value={opening_soundtrack}
          onChange={(e) => set_opening_soundtrack(e.target.value)}/>
          </div>
          {/* <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Opening Band"
            />
          </div> */}
          <div className="col">
            <input type="text" className="form-control" placeholder="Ending Soundtrack" value={ending_soundtrack}
          onChange={(e) => set_ending_soundtrack(e.target.value)} />
          </div>
          {/* <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Ending Band"
            />
          </div> */}
        </div>
        <input
          className="form-control"
          type="text"
          placeholder="Streaming Sites"
          value={streaming_sites}
          onChange={(e) => set_streaming_sites(e.target.value)}
        />
        <div className="form-row">
          {/* <div className="form-group col">
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
          </div> */}
          <div className="form-group col">
            <input
              type="number"
              className="form-control"
              placeholder="Mal Score"
              value={mal_score}
              onChange={(e) => set_mal_score(e.target.value)}
            />
          </div>
        </div>

        <button type="button" onClick={handleAddAnime}>
          <Link to="/home">Add Anime</Link>
        </button>
      </form>
    </>
  );
}
