import React from "react";
import { useTable, useSortBy } from "react-table";
import CEDHTableComponent from "./CEDHTableComponent.js"

const PlayersView = ({ rawData, filters, loading }) => {
  const { conversionType, bronze, silver, gold, platinum, minEntries } = filters;

  // Aggregate data for players
  const aggregatedData = React.useMemo(() => {
    const groupedData = {};

    rawData
      .filter((entry) => {
        // Check player count tiers
        const tiers = [
          { enabled: bronze, range: [16, 32] },
          { enabled: silver, range: [32, 60] },
          { enabled: gold, range: [60, 128] },
          { enabled: platinum, range: [128, Infinity] },
        ];
        return tiers.some(({ enabled, range }) => enabled && entry.playerCount >= range[0] && entry.playerCount < range[1]);
      })
      .forEach((entry) => {
        if (!entry.playerName) return;

        const key = entry.playerName;

        if (!groupedData[key]) {
          groupedData[key] = {
            playerName: entry.playerName,
            commanderCounts: {},
            recentCommanderDates: {}, // Track the most recent date for each pair
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

        const playerData = groupedData[key];
        const commanderPair = `${entry.commander1 || "N/A"}${entry.commander2 ? ` & ${entry.commander2}` : ""}`;

        // Increment commander counts
        playerData.commanderCounts[commanderPair] = (playerData.commanderCounts[commanderPair] || 0) + 1;

        // Update the most recent date for this commander pair
        playerData.recentCommanderDates[commanderPair] = Math.max(
          playerData.recentCommanderDates[commanderPair] || 0,
          new Date(entry.startDate).getTime()
        );

        // Update player stats
        playerData.totalEntries += 1;
        playerData.totalWins += entry.wins;
        playerData.totalLosses += entry.losses;
        playerData.totalDraws += entry.draws;
        playerData.totalGames += entry.wins + entry.losses + entry.draws;

        if (entry.standing === 1) playerData.top1 += 1;
        if (entry.standing <= 4) playerData.top4 += 1;
        if (entry.standing <= entry.topCut) playerData.topCut += 1;
      });

    return Object.values(groupedData)
      .map((group) => {
        // Determine most played commander pair with a tiebreaker for most recent date
        const [commonCommanderPair] = Object.entries(group.commanderCounts).reduce(
          (mostPlayed, [pair, count]) => {
            if (pair === "N/A") { return mostPlayed }
            
            const mostPlayedCount = mostPlayed[1];
            const mostPlayedDate = group.recentCommanderDates[mostPlayed[0]] || 0;
            const pairDate = group.recentCommanderDates[pair] || 0;

            if (count > mostPlayedCount) {
              // Higher count takes precedence
              return [pair, count];
            } else if (count === mostPlayedCount && pairDate > mostPlayedDate) {
              // Tiebreaker: More recent date
              return [pair, count];
            }
            return mostPlayed;
          },
          ["Unknown", 0]
        );

        const commonCommanderPairArray = commonCommanderPair.split(" & ");
        const commonCommander1 = commonCommanderPairArray[0];
        const commonCommander2 = commonCommanderPairArray[1];

        return {
          ...group,
          commonCommander1: commonCommander1,
          commonCommander2: commonCommander2,
          colorIdentity: rawData.find((x) => x.commander1 === commonCommander1 && (!commonCommander2 || x.commander2 === commonCommander2))?.colorIdentity || "N/A",
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
        };
      })
      .filter((row) => row.totalEntries >= minEntries);
  }, [rawData, bronze, silver, gold, platinum, minEntries]);

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Player Name",
        accessor: "playerName",
      },
      {
        Header: "Commanders",
        accessor: "commonCommander1",
        Cell: ({row}) => {
          const commonCommander1 = row.original.commonCommander1;
          const commonCommander2 = row.original.commonCommander2;
          const splitFlipCommander1 = commonCommander1.split(" // ");
          const colorIdentity = row.original.colorIdentity;
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
              {commonCommander2 && (
                <>
                  {" &"}
                  <br />
                  {commonCommander2}
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
        }
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

  const tableInstance =  useTable(
    { 
      columns, 
      data: aggregatedData,
      initialState: {
        sortBy: [
          {id: "winRate", desc: true},
        ],
      }, 
    },
    useSortBy
  );

  // Render table
  return <CEDHTableComponent {...tableInstance} loading={loading} />;
};

export default PlayersView;
