import React, { useEffect, useState } from "react";
import axios from "axios";
import MultiSelect from "multiselect-react-dropdown";
import Pagination from "./pagination2";
import AnimeItem from "./animeItem";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";
import Typewriter from "typewriter-effect";

function AdvancedSearch() {
  const [searchString, setSearchString] = useState("");
  const seasonsOptions = [
    { name: "summer", id: 1 },
    { name: "fall", id: 2 },
    { name: "winter", id: 3 },
    { name: "spring", id: 4 },
  ];
  const [seasons, setSeasons] = useState([
    "summer",
    "fall",
    "winter",
    "spring",
  ]);
  const [currentSeasons, setCurrentSeasons] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [year, setYear] = useState("");
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

  const [rating, setRating] = useState(0);
  const [types, setTypes] = useState([]);
  const [demographic, setDemographic] = useState("");
  const [source, setSource] = useState([]);
  const [episodes, setEpisodes] = useState("");
  const [characters, setCharacters] = useState("");

  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);

  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAgeRating, setSelectedAgeRating] = useState("");
  const [selectedDemographic, setSelectedDemographic] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [animeList, setAnimeList] = useState([]);
  const [isAnime, setIsAnime] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);

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
      // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

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

  useEffect(() => {
    getGenres();
    getTags();
    getSources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Search String: ", searchString);
    console.log(
      "Seasons: ",
      selectedSeasons.map((item) => item.name).join(", ")
    );
    console.log("Genres: ", selectedGenres);
    console.log("Year: ", year);
    console.log("Age Rating: ", selectedAgeRating);
    console.log("Rating: ", rating);
    console.log("Types: ", selectedType);
    console.log("Demographic: ", selectedDemographic);
    console.log("Source: ", selectedSource);
    console.log("Episodes: ", episodes);
    console.log("Characters: ", characters);

    const searchSeasons = selectedSeasons.map((item) => item.name).join(", ");
    const searchGenres = selectedGenres
      .map((item) => item.genre_name)
      .join(", ");
    const searchTypes = selectedType.map((item) => item.name).join(", ");
    const searchDemographic = selectedDemographic
      .map((item) => item.name)
      .join(", ");
    const searchSource = selectedSource
      .map((item) => item.anime_source)
      .join(", ");
    const searchTags = "";

    const res = await axios.post(`http://localhost:3000/AdvancedSearch`, {
      searchString: searchString,
      season: searchSeasons,
      genre: searchGenres,
      tag: searchTags,
      year: year,
      ageRating: selectedAgeRating,
      rating: rating,
      type: searchTypes,
      demographic: searchDemographic,
      source: searchSource,
      episodeCount: episodes,
      characters: characters,
    });
    setAnimeList(res.data);
    setIsAnime(true);
    console.log(res.data);
    setLoading(false);
  };

  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentanimes = animeList.slice(indexOfFirstAnime, indexOfLastAnime);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigate = useNavigate();

  if (loadingGenres || loadingTags || loadingSources) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <div>
          <label>Seasons</label>
          <MultiSelect
            options={seasonsOptions}
            displayValue="name"
            onSelect={onSelect}
            onRemove={onRemove}
            selectedValues={selectedSeasons}
          />
        </div>

        <div>
          <label htmlFor="genres">Genres</label>
          <MultiSelect
            options={genres}
            displayValue="genre_name"
            onSelect={onSelectGenres}
            onRemove={onRemoveGenres}
            selectedValues={selectedGenres}
            placeholder="Select Genres"
          />
        </div>

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <div>
          <label htmlFor="ageRating">Age Rating</label>
          <select
            id="ageRating"
            value={selectedAgeRating}
            onChange={handleAgeRatingChange}
          >
            <option value="">Select Age Rating</option>
            {ageRatingOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <label>User Rating</label>
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <div>
          <label>Types</label>
          <MultiSelect
            options={typeOptions}
            displayValue="name"
            onSelect={onSelectType}
            onRemove={onRemoveType}
            selectedValues={selectedType}
          />
        </div>

        <div>
          <label>Demographic</label>
          <MultiSelect
            options={dempgraphicOptions}
            displayValue="name"
            onSelect={onSelectDemo}
            onRemove={onRemoveDemo}
            selectedValues={selectedDemographic}
          />
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <MultiSelect
            options={tags}
            displayValue="tag_name"
            onSelect={onSelectTags}
            onRemove={onRemoveTags}
            selectedValues={selectedTags}
            placeholder="Select Tags"
          />
        </div>

        <div>
          <label htmlFor="source">Source</label>
          <MultiSelect
            options={source}
            displayValue="anime_source"
            onSelect={onSelectSource}
            onRemove={onRemoveSource}
            selectedValues={selectedSource}
            placeholder="Select Source"
          />
        </div>

        <input
          type="number"
          placeholder="Episodes"
          value={episodes}
          onChange={(e) => setEpisodes(e.target.value)}
        />
        <input
          type="text"
          placeholder="Characters"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Search
        </button>
      </form>
      <div>
        <div className="row">
          <section>
            <div className="anime-list-container">
              <AnimeItem currentanimes={currentanimes} loading={loading} />
            </div>
          </section>
          <section className="pagination-container">
            <Pagination
              animePerPage={animePerPage}
              totalAnimes={animeList.length}
              paginate={paginate}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearch;
