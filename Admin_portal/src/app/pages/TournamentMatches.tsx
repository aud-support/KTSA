import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus, Trophy, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useCMS } from "../context/CMSContext";

interface Match {
  id: string;
  player1: string;
  player2: string;
  score1: string;
  score2: string;
  round: string;
  status: "scheduled" | "ongoing" | "completed";
  scheduledTime?: string;
}

export const TournamentMatches: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useCMS();

  const tournament = tournaments.find((t) => t.id === id);

  // Dummy matches data
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      player1: "Rajesh Kumar",
      player2: "Amit Sharma",
      score1: "3",
      score2: "1",
      round: "Quarter Finals",
      status: "completed",
    },
    {
      id: "2",
      player1: "Priya Patel",
      player2: "Sanjay Reddy",
      score1: "2",
      score2: "3",
      round: "Quarter Finals",
      status: "completed",
    },
    {
      id: "3",
      player1: "Vikram Singh",
      player2: "Neha Gupta",
      score1: "0",
      score2: "0",
      round: "Semi Finals",
      status: "scheduled",
      scheduledTime: "2026-06-15 14:00",
    },
    {
      id: "4",
      player1: "Arun Verma",
      player2: "Kavita Das",
      score1: "1",
      score2: "2",
      round: "Semi Finals",
      status: "ongoing",
    },
  ]);

  if (!tournament) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2">Tournament not found</h2>
          <Button onClick={() => navigate("/tournaments")}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ongoing":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/tournaments")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Tournaments
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
              {tournament.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-ktsa-accent" />
                {new Date(tournament.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {tournament.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-ktsa-accent" />
                  {tournament.venue}
                </div>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs border ${
                  tournament.status === "upcoming"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : tournament.status === "ongoing"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }`}
              >
                {tournament.status}
              </span>
            </div>
          </div>
          <Button
            onClick={() => toast.info("Add match functionality coming soon")}
          >
            <Plus size={20} className="mr-2" />
            Add Match
          </Button>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <Card
            key={match.id}
            className="p-6 hover:border-ktsa-accent/30 transition-all"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-ktsa-accent font-semibold uppercase tracking-wider">
                    {match.round}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(match.status)}`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* Players */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-foreground font-medium">
                      {match.player1}
                    </span>
                    <span
                      className={`text-2xl font-bold ${match.status === "completed" && parseInt(match.score1) > parseInt(match.score2) ? "text-ktsa-primary" : "text-muted-foreground"}`}
                    >
                      {match.score1}
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-foreground font-medium">
                      {match.player2}
                    </span>
                    <span
                      className={`text-2xl font-bold ${match.status === "completed" && parseInt(match.score2) > parseInt(match.score1) ? "text-ktsa-primary" : "text-muted-foreground"}`}
                    >
                      {match.score2}
                    </span>
                  </div>
                </div>

                {match.scheduledTime && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Scheduled: {new Date(match.scheduledTime).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toast.info("Edit match functionality coming soon")
                  }
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card className="p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No matches yet</h3>
          <p className="text-muted-foreground mb-6">
            Add matches to this tournament to get started.
          </p>
          <Button
            onClick={() => toast.info("Add match functionality coming soon")}
          >
            <Plus size={20} className="mr-2" />
            Add First Match
          </Button>
        </Card>
      )}
    </div>
  );
};
