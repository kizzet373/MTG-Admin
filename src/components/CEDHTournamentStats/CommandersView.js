import React from "react";
import { useTable, useSortBy } from "react-table";
import CEDHTableComponent from "./CEDHTableComponent.js"

const CommandersView = ({ rawData, filters, loading }) => {
  const { conversionType, bronze, silver, gold, platinum, minEntries } = filters;

  // Aggregate data for commanders
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
        
        const key = `${entry.commander1}${entry.commander2 ? ` & ${entry.commander2}`: ''}`;

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

        const commanderData = groupedData[key];
        commanderData.totalEntries += 1;
        commanderData.totalWins += entry.wins;
        commanderData.totalLosses += entry.losses;
        commanderData.totalDraws += entry.draws;
        commanderData.totalGames += entry.wins + entry.losses + entry.draws;

        if (entry.standing === 1) commanderData.top1 += 1;
        if (entry.standing <= 4) commanderData.top4 += 1;
        if (entry.standing <= entry.topCut) commanderData.topCut += 1;
      });

    return Object.values(groupedData)
      .map((group) => ({
        ...group,
        winRate: group.totalGames
          ? ((group.totalWins / group.totalGames) * 100).toFixed(2)
          : "0.00",
        top1ConversionRate: group.totalEntries
          ? ((group.top1 / group.totalEntries) * 100).toFixed(2)
          : "0.00",
        top4ConversionRate: group.totalEntries
          ? ((group.top4 / group.totalEntries) * 100).toFixed(2)
          : "0.00",
        topCutConversionRate: group.totalEntries
          ? ((group.topCut / group.totalEntries) * 100).toFixed(2)
          : "0.00",
      }))
      .filter((row) => row.totalEntries >= minEntries);
  }, [rawData, bronze, silver, gold, platinum, minEntries]);

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Commanders",
        accessor: (row) => {
          const splitFlipCommander1 = row.commander1.split(" // ");
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
              {splitFlipCommander1.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < splitFlipCommander1.length - 1 && <br />}
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
        Header: `# of ${
          { top1: "Top 1", top4: "Top 4", topCut: "Top Cut" }[conversionType] || "Unknown"
        }s`,
        id: "conversions",
        accessor: (row) => row[conversionType],
      },
      {
        Header: `${
          { top1: "Top 1", top4: "Top 4", topCut: "Top Cut" }[conversionType] || "Unknown"
        } Rate`,
        id: "conversionRate",
        accessor: (row) => row[`${conversionType}ConversionRate`],
        Cell: ({ value }) => `${value}%`,
      },
    ],
    [conversionType]
  );

  const tableInstance = useTable(
    { 
      columns, 
      data: aggregatedData,
      initialState: {
        sortBy: [
          {id: "conversions", desc: true},
        ],
      },
    },
    useSortBy
  );

  // Render table
  return <CEDHTableComponent {...tableInstance} loading={loading} />;
};

export default CommandersView;
