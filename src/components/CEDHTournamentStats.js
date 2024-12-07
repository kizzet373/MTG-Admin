import React, { useEffect, useState, useRef } from "react";
import { useTable, useSortBy } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "../css/CEDHTournamentStats.css";

const CEDHTournamentStats = () => {
    // ---- Dates Variables -----
    const now = new Date();
    const bansDate = new Date("2024,10,23");

    const [dateRange, setDateRange] = useState({
        start: bansDate,
        end: now,
    });

    const previousDateRange = useRef({
        start: bansDate,
        end: now,
    });
    // --------------------------

    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [conversionType, setConversionType] = useState("top4");
    const [bronze, setBronze] = useState(false);
    const [silver, setSilver] = useState(false);
    const [gold, setGold] = useState(true);
    const [platinum, setPlatinum] = useState(true);
    const [minEntries, setMinEntries] = useState(5);

    const fetchTournamentStats = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `https://www.mtg-admin.com/api/tournament-stats/startdate=${Math.floor(dateRange.start.getTime() / 1000)}&enddate=${Math.floor(dateRange.end.getTime() / 1000)}`
            );

            if (response.data && response.data.length > 0) {
                setRawData(response.data);
                setError("");
            } else {
                setRawData([]);
                setError("No data found for the selected filters.");
            }
        } 
        catch (err) { setError("Failed to fetch tournament stats. Check the console for more details.") } 
        finally { setLoading(false) }
    };

    // Initial fetch when the component loads
    useEffect(() => {
        fetchTournamentStats();
    }, []);

    // Aggregated data recalculates when raw data or filters change
    const aggregatedData = React.useMemo(() => {
        const groupedData = {};

        rawData
            .filter((entry) => {
                const isBronze = bronze && entry.playerCount >= 16 && entry.playerCount < 32;
                const isSilver = silver && entry.playerCount >= 32 && entry.playerCount < 60;
                const isGold = gold && entry.playerCount >= 60 && entry.playerCount < 128;
                const isPlatinum = platinum && entry.playerCount >= 128;

                return isBronze || isSilver || isGold || isPlatinum;
            })
            .forEach((entry) => {
                if (!entry.commander1) return;
                const key = `${entry.commander1} & ${entry.commander2 || "Unknown"}`;

                if (!groupedData[key]) {
                    groupedData[key] = {
                        commander1: entry.commander1,
                        commander2: entry.commander2,
                        colorIdentity: entry.colorIdentity || "N/A",
                        totalEntries: 0,
                        totalWins: 0,
                        totalLosses: 0,
                        totalDraws: 0,
                        totalGames: 0,
                        top1: 0,
                        top4: 0,
                        topCut: 0,
                    };
                }

                groupedData[key].totalEntries += 1;
                groupedData[key].totalWins += entry.wins;
                groupedData[key].totalLosses += entry.losses;
                groupedData[key].totalDraws += entry.draws;
                groupedData[key].totalGames += entry.wins + entry.losses + entry.draws;

                if (entry.standing === 1) groupedData[key].top1 += 1;
                if (entry.standing <= 4) groupedData[key].top4 += 1;
                if (entry.standing <= entry.topCut) groupedData[key].topCut += 1;
            });

        return Object.values(groupedData)
            .map((group) => ({
                ...group,
                winRate: ((group.totalWins / group.totalGames) * 100).toFixed(2),
                top1ConversionRate: ((group.top1 / group.totalEntries) * 100).toFixed(2),
                top4ConversionRate: ((group.top4 / group.totalEntries) * 100).toFixed(2),
                topCutConversionRate: ((group.topCut / group.totalEntries) * 100).toFixed(2),
                percentOfMeta: group.totalEntries / rawData.length,
            }))
            .filter((row) => row.totalEntries >= minEntries)
            .sort((a,b) => a.winRate - b.winRate);
    }, [rawData, bronze, silver, gold, platinum, minEntries]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Commanders",
                accessor: (row) => {
                    const splitCommander1 = row.commander1.split(" // ");
                    const colorIdentity = row.colorIdentity;
                    const manaSymbols = {
                        W: "assets/W.webp",
                        U: "assets/U.webp",
                        B: "assets/B.webp",
                        R: "assets/R.webp",
                        G: "assets/G.webp",
                        C: "assets/C.webp",
                    };
                    return (
                        <div>
                            {splitCommander1.map((part, index) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {index < splitCommander1.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                            {row.commander2 && (
                                <>
                                    {" &"}
                                    <br />
                                    {row.commander2}
                                </>
                            )}
                            <div style={{ display: "flex", gap: "4px", marginTop: "3px" }}>
                                {[...colorIdentity].map((letter, index) => (
                                    <img
                                        key={index}
                                        src={manaSymbols[letter]}
                                        alt={letter}
                                        title={letter}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                },
            },
            { Header: "Entries", accessor: "totalEntries" },
            { Header: "Wins", accessor: "totalWins", className: "mobile-hidden" },
            { Header: "Losses", accessor: "totalLosses", className: "mobile-hidden" },
            { Header: "Draws", accessor: "totalDraws", className: "mobile-hidden" },
            {
                Header: "Winrate",
                accessor: "winRate",
                Cell: ({ value }) => `${value}%`,
            },
            {
                Header: `# of ${{top1: "Top 1", top4: "Top 4", topCut: "Top Cut" }[conversionType] || "Unknown"}s`,
                id: "conversions",
                accessor: (row) => row[`${conversionType}`],
              },
              {
                Header: `${{top1: "Top 1", top4: "Top 4", topCut: "Top Cut" }[conversionType] || "Unknown"} Rate`,
                id: "conversionRate",
                accessor: (row) => row[`${conversionType}ConversionRate`], // Dynamically return rate
                Cell: ({ value }) => `${value}%`,
              },
        ],
        [conversionType]
    );

    const memoizedData = React.useMemo(() => aggregatedData, [aggregatedData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: memoizedData,
            initialState: { sortBy: [{ id: "conversions", desc: true }] },
            autoResetSortBy: false,
        },
        useSortBy
    );

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div className="centered-container">
            <div className="wrapper">
                <h1>CEDH Tournament Stats</h1>
                <div className="filters">
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <div>
                            <label>Start Date:</label>
                            <DatePicker
                                selected={dateRange.start}
                                onChange={(date) =>
                                    setDateRange((prev) => ({ ...prev, start: date }))
                                }
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select start date"
                            />
                        </div>
                        <div>
                            <label>End Date:</label>
                            <DatePicker
                                selected={dateRange.end}
                                onChange={(date) =>
                                    setDateRange((prev) => ({ ...prev, end: date }))
                                }
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select end date"
                            />
                        </div>
                        <button className="filter-button"
                            onClick={() => {
                                if (previousDateRange.current.start.getTime() === dateRange.start.getTime() & previousDateRange.current.end.getTime() === dateRange.end.getTime())
                                    return;
                                if (dateRange.start > dateRange.end) {
                                    setError("Start date cannot be after end date.");
                                    return;
                                }
                                fetchTournamentStats();
                                previousDateRange.current = { ...dateRange };
                            }}
                            style={{ alignSelf: "flex-end", backgroundColor: "rgb(249, 249, 249)", color: "black", fontSize: "1rem" }}
                        >
                            Apply
                        </button>
                    </div>
                    <div className="tournament-filters" style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                        <button
                            onClick={() => setBronze((prev) => !prev)}
                            className={bronze ? "filter-button bronze active" : "filter-button bronze"}
                        >
                            Bronze
                            <span class="reminder">(16+ Players)</span>
                        </button>
                        <button
                            onClick={() => setSilver((prev) => !prev)}
                            className={silver ? "filter-button silver active" : "filter-button silver"}
                        >
                            Silver
                            <span class="reminder">(32+ Players)</span>
                        </button>
                        <button
                            onClick={() => setGold((prev) => !prev)}
                            className={gold ? "filter-button gold active" : "filter-button gold"}
                        >
                            Gold
                            <span class="reminder">(60+ Players)</span>
                        </button>
                        <button
                            onClick={() => setPlatinum((prev) => !prev)}
                            className={platinum ? "filter-button platinum active" : "filter-button platinum"}
                        >
                            Platinum
                            <span class="reminder">(128+ Players)</span>
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
                                onChange={(e) => setMinEntries(Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Conversion Type:
                            <select
                                value={conversionType}
                                onChange={(e) => setConversionType(e.target.value)}
                            >
                                <option value="top1">Top 1</option>
                                <option value="top4">Top 4</option>
                                <option value="topCut">Top Cut</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="cedh-table-wrapper">
                    <table {...getTableProps()} className="cedh-table">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={`${column.className || ""} ${column.isSorted ? (column.isSortedDesc ? "desc" : "asc") : ""}`}
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                        Loading tournament stats...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                        No data available for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <td 
                                                    {...cell.getCellProps()}
                                                    className={`${cell.column.className || ""}`}
                                                >{cell.render("Cell")}</td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CEDHTournamentStats;
