import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useCMS } from "../context/CMSContext";
import {
  getAllTournaments,
  deleteTournament as deleteTournamentAPI,
} from "../../services/tournamentService"; // ← import API fns

export const Tournaments: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<any[]>([]); // ← local state, not from context
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ← fetch on mount
  useEffect(() => {
    getAllTournaments()
      .then((res) => setTournaments(res.data))
      .catch(() => toast.error("Failed to load tournaments"));
  }, []);

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await deleteTournamentAPI(id); // ← call API
        setTournaments((prev) => prev.filter((t) => t.id !== id)); // ← remove locally
        toast.success("Tournament deleted successfully!");
      } catch {
        toast.error("Failed to delete tournament");
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "ongoing":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-accent">Tournaments</h1>
          <p className="text-muted-foreground">
            Manage all KTSA tournament entries
          </p>
        </div>
        <Button onClick={() => navigate("/tournaments/new")}>
          <Plus size={20} className="mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Tournaments Table */}
      <Card className="overflow-hidden p-0">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Tournament
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Prize Pool
                </th>
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tournaments.map((tournament) => (
                <tr
                  key={tournament.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="px-6 py-2">
                    <button
                      onClick={() =>
                        navigate(`/tournaments/${tournament.id}/matches`)
                      }
                      className="font-medium hover:text-ktsa-primary transition-colors text-left"
                    >
                      {tournament.tournamentName}
                    </button>
                  </td>
                  <td className="px-6 py-2 text-sm text-muted-foreground">
                    <div>{new Date(tournament.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}</div>
                    <div className="text-xs text-muted-foreground/70">
                      {new Date(tournament.startDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                        tournament.status,
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-sm text-muted-foreground">
                    {tournament.format}
                  </td>
                  <td className="px-6 py-2 text-sm text-muted-foreground">
                    {tournament.venue || "—"}
                  </td>
                  <td className="px-6 py-2 text-sm text-muted-foreground">
                    {tournament.pricePool ? `₹${tournament.pricePool}` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() =>
                          navigate(`/tournaments/${tournament.id}/edit`)
                        }
                        className="text-ktsa-primary hover:text-ktsa-highlight transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tournament.id)}
                        className={`transition-colors ${
                          deleteConfirm === tournament.id
                            ? "text-destructive font-semibold"
                            : "text-destructive/70 hover:text-destructive"
                        }`}
                        title={
                          deleteConfirm === tournament.id
                            ? "Click again to confirm"
                            : "Delete"
                        }
                      >
                        {deleteConfirm === tournament.id
                          ? "Confirm?"
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="lg:hidden divide-y divide-border">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <button
                    onClick={() =>
                      navigate(`/tournaments/${tournament.id}/matches`)
                    }
                    className="font-medium mb-1 hover:text-ktsa-primary transition-colors text-left"
                  >
                    {tournament.tournamentName}
                  </button>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getStatusColor(
                        tournament.status,
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {new Date(tournament.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                <span className="text-xs text-muted-foreground/70">
                  {new Date(tournament.startDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(`/tournaments/${tournament.id}/matches`)
                  }
                >
                  View Matches
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tournaments/${tournament.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(tournament.id)}
                >
                  {deleteConfirm === tournament.id ? "Confirm?" : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="p-12 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No tournaments yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first tournament to get started.
            </p>
            <Button onClick={() => navigate("/tournaments/new")}>
              <Plus size={20} className="mr-2" />
              Create Tournament
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
