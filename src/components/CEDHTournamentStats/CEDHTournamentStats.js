import React, { useEffect, useState, useRef } from "react";
import "./CEDHTournamentStats.scss"
import axios from "axios";
import CommandersView from "./CommandersView";
import PlayersView from "./PlayersView";
import TournamentsView from "./TournamentsView";

const CEDHTournamentStats = () => {
  const now = new Date();
  const bansDate = new Date("2024-09-23");

  const formatDateToISO = (date) => {
    if (!date) return ""; // Handle null or undefined
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dateRange, setDateRange] = useState({
    start: bansDate,
    end: now,
  });

  const handleDateChange = (key, value) => {
    const selectedDate = new Date(value);

    // Validate the selected date and update the state if valid and different
    if (!isNaN(selectedDate.getTime()) && selectedDate.getTime() !== dateRange[key].getTime()) {
      setDateRange((prev) => ({
        ...prev,
        [key]: selectedDate,
      }));
    }
  };

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversionType, setConversionType] = useState("topCut");
  const [bronze, setBronze] = useState(false);
  const [silver, setSilver] = useState(false);
  const [gold, setGold] = useState(true);
  const [platinum, setPlatinum] = useState(true);
  const [minEntries, setMinEntries] = useState(5);

  const [view, setView] = useState("commanders");

  const fetchTournamentStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.mtg-admin.com/api/tournament-stats/startdate=${Math.floor(
          dateRange.start.getTime() / 1000
        )}&enddate=${Math.floor(dateRange.end.getTime() / 1000)}`
      );

      if (response.data && response.data.length > 0) {
        setRawData(response.data);
        setError("");
      } else {
        setRawData([]);
        setError("No data found for the selected filters.");
      }
    } catch (err) {
      setError("Failed to fetch tournament stats. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentStats();
  }, [dateRange]);

  const filters = {
    bronze,
    silver,
    gold,
    platinum,
    minEntries,
    conversionType,
  };

  const updateFilter = (filterName, value) => {
    switch (filterName) {
      case "bronze":
        setBronze(value);
        break;
      case "silver":
        setSilver(value);
        break;
      case "gold":
        setGold(value);
        break;
      case "platinum":
        setPlatinum(value);
        break;
      case "minEntries":
        setMinEntries(value);
        break;
      case "conversionType":
        setConversionType(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="centered-container">
      <div className="wrapper">
        <h1>CEDH Tournament Stats</h1>
        <div className="filters">
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div>
              <label htmlFor="start-date">Start Date:</label>
              <input
                id="start-date"
                type="date"
                value={formatDateToISO(dateRange.start)}
                onChange={(e) => handleDateChange("start", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={formatDateToISO(dateRange.end)}
                onChange={(e) => handleDateChange("end", e.target.value)}
              />
            </div>
          </div>
          <div className="tournament-filters">
            <button
              onClick={() => updateFilter("bronze", !bronze)}
              className={bronze ? "filter-button bronze active" : "filter-button bronze"}
            >
              Bronze
            </button>
            <button
              onClick={() => updateFilter("silver", !silver)}
              className={silver ? "filter-button silver active" : "filter-button silver"}
            >
              Silver
            </button>
            <button
              onClick={() => updateFilter("gold", !gold)}
              className={gold ? "filter-button gold active" : "filter-button gold"}
            >
              Gold
            </button>
            <button
              onClick={() => updateFilter("platinum", !platinum)}
              className={platinum ? "filter-button platinum active" : "filter-button platinum"}
            >
              Platinum
            </button>
          </div>
          <div className="entries-filter">
            <label>
              Min Entries:
              <input
                type="number"
                value={minEntries}
                min="0"
                maxLength="4"
                onChange={(e) => updateFilter("minEntries", Number(e.target.value))}
              />
            </label>
            <label>
              Conversion Type:
              <select
                value={conversionType}
                onChange={(e) => updateFilter("conversionType", e.target.value)}
              >
                <option value="top1">Top 1</option>
                <option value="top4">Top 4</option>
                <option value="topCut">Top Cut</option>
              </select>
            </label>
          </div>
        </div>
        <div>
        <button onClick={() => {setView("commanders"); setMinEntries(5);}}>Commanders</button>
        <button onClick={() => {setView("players"); setMinEntries(2);}}>Players</button>
          {<button onClick={() => setView("tournaments")}>Tournaments</button>}
        </div>
        {view === "commanders" && <CommandersView rawData={rawData} filters={filters} loading={loading}/>}
        {view === "players" && <PlayersView rawData={rawData} filters={filters} loading={loading}/>}
        {/*view === "tournaments" && <TournamentsView rawData={rawData} filters={filters} loading={loading} />*/}
      </div>
    </div>
  );
};

export default CEDHTournamentStats;