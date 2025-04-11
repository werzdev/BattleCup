"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuthorizedApi } from "@/lib/useAuthorizedApi";

type Player = {
  id: string;
  name: string;
};

export default function GamesPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const api = useAuthorizedApi();

  useEffect(() => {
    api
      .get("/players")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (team: "A" | "B", playerId: string) => {
    // Prevent player from being on both teams
    if (team === "A") {
      setTeamA((prev) => {
        const updated = prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId];
        return updated.slice(0, 2); // max 2
      });
      setTeamB((prev) => prev.filter((id) => id !== playerId));
    } else {
      setTeamB((prev) => {
        const updated = prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId];
        return updated.slice(0, 2); // max 2
      });
      setTeamA((prev) => prev.filter((id) => id !== playerId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (teamA.length !== 2 || teamB.length !== 2) {
      setError("Please select 2 players for each team.");
      setLoading(false);
      return;
    }

    const participants = [
      ...teamA.map((id) => ({ playerId: id, team: "A" })),
      ...teamB.map((id) => ({ playerId: id, team: "B" })),
    ];

    try {
      await api.post("/games", { participants, teamAScore, teamBScore });
      setTeamA([]);
      setTeamB([]);
      setTeamAScore(0); // reset after submit
      setTeamBScore(0);
      setSuccess(true);
    } catch (err) {
      setError("Failed to create game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Create 2v2 Game</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Team A</h2>
            <div className="grid grid-cols-2 gap-2">
              {players.map((player) => (
                <label key={player.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={teamA.includes(player.id)}
                    onChange={() => handleSelect("A", player.id)}
                    disabled={teamB.includes(player.id)}
                  />
                  <span>{player.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Team B</h2>
            <div className="grid grid-cols-2 gap-2">
              {players.map((player) => (
                <label key={player.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={teamB.includes(player.id)}
                    onChange={() => handleSelect("B", player.id)}
                    disabled={teamA.includes(player.id)}
                  />
                  <span>{player.name}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && (
            <p className="text-green-500">Game created successfully!</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Game"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
