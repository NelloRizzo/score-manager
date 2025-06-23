import React, { useEffect, useState } from "react";
import "./App.css";

interface RoundScore {
  teamA: number;
  teamB: number;
}

const LOCAL_STORAGE_KEY = "roundScores";

const App: React.FC = () => {
  const [rounds, setRounds] = useState<RoundScore[]>([
    { teamA: 0, teamB: 0 }
  ]);

  const addRound = () => {
    setRounds([...rounds, { teamA: 0, teamB: 0 }]);
  };

  const updateScore = (
    index: number,
    team: "teamA" | "teamB",
    value: string
  ) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][team] = parseInt(value) || 0;
    setRounds(updatedRounds);
  };

  const totalTeamA = rounds.reduce((sum, r) => sum + r.teamA, 0);
  const totalTeamB = rounds.reduce((sum, r) => sum + r.teamB, 0);
  const [names, setNames] = useState<{ teamA: string, teamB: string }>({ teamA: "Squadra 1", teamB: "Squadra 2" })

  const updateName = (team: "teamA" | "teamB", name: string) => {
    setNames({ ...names, [team]: name })
  }
  const resetRounds = () => {
    if (window.confirm("Sei sicuro di voler azzerare tutti i punteggi?")) {
      setRounds([{ teamA: 0, teamB: 0 }]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRounds(parsed);
        }
      } catch {
        // in caso di errore, ignora
      }
    }
  }, []);
  // ✅ Salva i punteggi ad ogni aggiornamento
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rounds));
  }, [rounds]);

  return (
    <div className="App">
      <h1>Scoreboard</h1>
      <h2><input type="text" value={names.teamA} onChange={(e) => updateName("teamA", e.target.value)} /> vs <input type="text" value={names.teamB} onChange={(e) => updateName("teamB", e.target.value)} /></h2>

      <table>
        <thead>
          <tr>
            <th>Manche</th>
            <th>{names.teamA}</th>
            <th>{names.teamB}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="totals">
            <td><strong>Totale</strong></td>
            <td><strong>{totalTeamA}</strong></td>
            <td><strong>{totalTeamB}</strong></td>
          </tr>
          {rounds.map((round, index) => (
            <tr key={index}>
              <td>Manche {index + 1}</td>
              <td>
                <input
                  type="number"
                  value={round.teamA}
                  onChange={(e) => updateScore(index, "teamA", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={round.teamB}
                  onChange={(e) => updateScore(index, "teamB", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">

        <button onClick={addRound}>➕ Aggiungi Manche</button>
        <button className="reset" onClick={resetRounds}>🗑️ Reset</button>
      </div>
    </div>
  );
};

export default App;
