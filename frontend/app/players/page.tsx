"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuthorizedApi } from "@/lib/useAuthorizedApi";

type Player = {
  id: string;
  name: string;
  avatarUrl: string; // Added avatarUrl to the player object
  wins: number;
  losses: number;
  winRate?: number;
  hits: number;
  misses: number;
  hitrate?: number;
  bombHits: number;
  bombMisses: number;
  bombHitrate?: number;
  bounceHits: number;
  bounceMisses: number;
  bounceHitrate?: number;
  beer: number;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const api = useAuthorizedApi();

  const fetchPlayers = async () => {
    const res = await api.get("/players");
    setPlayers(res.data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    if (avatar) {
      formData.append("avatar", avatar); // Append the avatar image
    }

    try {
      await api.post("/players", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setAvatar(null);
      fetchPlayers();
      setIsFormOpen(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create player.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = async (playerId: string) => {
    try {
      const res = await api.get(`/players/${playerId}/stats`);
      const updatedPlayer = {
        ...players.find((player) => player.id === playerId),
        ...res.data,
      };
      setSelectedPlayer(updatedPlayer);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch player stats:", err);
      setError("Failed to fetch player stats.");
    }
  };

  return (
    <RequireAuth>
      <main className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Players</h1>

        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          +
        </button>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow-lg fixed top-1/4 left-1/2 transform -translate-x-1/2 w-80 z-50"
          >
            <div>
              <label className="block">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block">Avatar</label>
              <input
                type="file"
                className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Player"}
            </button>

            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
            >
              Cancel
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}

        <ul className="space-y-2 mt-12">
          {players.map((player) => (
            <li
              key={player.id}
              className="p-4 bg-white dark:bg-gray-800 rounded shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:3001` + player.avatarUrl}
                  alt={`${player.name}'s Avatar`}
                  className="w-12 h-12 rounded-full"
                />
                <strong>{player.name}</strong>
              </div>
            </li>
          ))}
        </ul>

        {isModalOpen && selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {selectedPlayer.avatarUrl && (
                <img
                  src={`http://localhost:3001` + selectedPlayer.avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
              )}

              <h2 className="text-xl font-bold mb-4 text-center">
                {selectedPlayer.name}'s {isEditing ? "Edit" : "Stats"}
              </h2>

              {!isEditing ? (
                <>
                  <p>
                    <strong>Wins:</strong> {selectedPlayer.wins ?? "N/A"}
                  </p>
                  <p>
                    <strong>Losses:</strong> {selectedPlayer.losses ?? "N/A"}
                  </p>
                  {selectedPlayer.wins > 0 && selectedPlayer.losses > 0 && (
                    <p>
                      <strong>Winrate:</strong>{" "}
                      {selectedPlayer.winRate ?? "N/A"}%
                    </p>
                  )}
                  <p>
                    <strong>Hits:</strong> {selectedPlayer.hits ?? "N/A"}
                  </p>
                  <p>
                    <strong>Misses:</strong> {selectedPlayer.misses ?? "N/A"}
                  </p>
                  {selectedPlayer.hits > 0 && selectedPlayer.misses > 0 && (
                    <p>
                      <strong>Hitrate:</strong>{" "}
                      {selectedPlayer.hitrate ?? "N/A"}%
                    </p>
                  )}
                  <p>
                    <strong>Bomb Hits:</strong>{" "}
                    {selectedPlayer.bombHits ?? "N/A"}
                  </p>
                  <p>
                    <strong>Bomb Misses:</strong>{" "}
                    {selectedPlayer.bombMisses ?? "N/A"}
                  </p>
                  {selectedPlayer.bombHits > 0 &&
                    selectedPlayer.bombMisses > 0 && (
                      <p>
                        <strong>Bomb Hitrate:</strong>{" "}
                        {selectedPlayer.bombHitrate ?? "N/A"}%
                      </p>
                    )}
                  <p>
                    <strong>Bounce Hits:</strong>{" "}
                    {selectedPlayer.bounceHits ?? "N/A"}
                  </p>
                  <p>
                    <strong>Bounce Misses:</strong>{" "}
                    {selectedPlayer.bounceMisses ?? "N/A"}
                  </p>
                  {selectedPlayer.bounceHits > 0 &&
                    selectedPlayer.bounceMisses > 0 && (
                      <p>
                        <strong>Bounce Hitrate:</strong>{" "}
                        {selectedPlayer.bounceHitrate ?? "N/A"}%
                      </p>
                    )}
                  <p>
                    <strong>Beer:</strong> {selectedPlayer.beer ?? "N/A"}
                  </p>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded w-full"
                  >
                    Edit
                  </button>
                </>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("name", selectedPlayer.name);
                    if (selectedPlayer.avatarUrl) {
                      formData.append("avatar", selectedPlayer.avatarUrl);
                    }

                    try {
                      await api.patch(
                        `/players/${selectedPlayer.id}`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      );
                      fetchPlayers();
                      setIsModalOpen(false);
                      setIsEditing(false);
                    } catch (err) {
                      console.error("Failed to update player:", err);
                      setError("Failed to update player.");
                    }
                  }}
                  className="space-y-4"
                >
                  <label className="block">
                    New Name:
                    <input
                      type="text"
                      value={selectedPlayer.name}
                      onChange={(e) =>
                        setSelectedPlayer(
                          (p) => p && { ...p, name: e.target.value },
                        )
                      }
                      className="w-full p-2 mt-1 rounded bg-white dark:bg-gray-700 border"
                    />
                  </label>

                  <label className="block">
                    Avatar:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedPlayer((p) =>
                          p
                            ? {
                                ...p,
                                avatarFile: e.target.files?.[0] ?? undefined,
                              }
                            : p,
                        )
                      }
                      className="mt-1"
                    />
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </RequireAuth>
  );
}
