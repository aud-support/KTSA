import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Trophy,
  Calendar,
  MapPin,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
// Add this:
import { getTournamentById } from "../../services/tournamentService"; // adjust path if needed
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  getMatchesByTournament,
  createMatch,
  updateMatch,
  searchPlayers,
  searchTeams,
  MatchResponseDto,
  MatchRequestDto,
  MatchUpdateDto,
} from "../../services/matchService";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_OPTIONS = [
  { value: "group", label: "Group" },
  { value: "quarterfinal", label: "Quarter Final" },
  { value: "semifinal", label: "Semi Final" },
  { value: "final", label: "Final" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_EDIT_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Reusable SearchInput ──────────────────────────────────────────────────────

interface SearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  selectedId: number | null;
  onSearch: (query: string) => Promise<{ id: number; label: string }[]>;
  onSelect: (id: number, label: string) => void;
  onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  placeholder,
  value,
  selectedId,
  onSearch,
  onSelect,
  onClear,
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<{ id: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (selectedId) onClear();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await onSearch(val);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-8 pr-8 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
        />
        {(query || selectedId) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
              onClear();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
        {loading && (
          <Loader2
            size={14}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
          />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelect(r.id, r.label);
                setQuery(r.label);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-sm px-3 py-2 text-sm text-muted-foreground">
          No results found
        </div>
      )}
    </div>
  );
};

// ─── CreateMatchModal ──────────────────────────────────────────────────────────

interface CreateMatchModalProps {
  tournamentId: number;
  onClose: () => void;
  onCreated: (match: MatchResponseDto) => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  tournamentId,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState<MatchRequestDto>({
    stage: "",
    scheduledAt: "",
    status: "scheduled",
    playerOne: null,
    playerTwo: null,
    teamOne: null,
    teamTwo: null,
    roundNumber: 1,
  });
  const [matchType, setMatchType] = useState<"player" | "team">("player");
  const [playerOneLabel, setPlayerOneLabel] = useState("");
  const [playerTwoLabel, setPlayerTwoLabel] = useState("");
  const [teamOneLabel, setTeamOneLabel] = useState("");
  const [teamTwoLabel, setTeamTwoLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: MatchRequestDto = {
        stage: form.stage,
        scheduledAt: form.scheduledAt,
        status: form.status,
        roundNumber: form.roundNumber,
        playerOne: matchType === "player" ? form.playerOne : null,
        playerTwo: matchType === "player" ? form.playerTwo : null,
        teamOne: matchType === "team" ? form.teamOne : null,
        teamTwo: matchType === "team" ? form.teamTwo : null,
      };
      const created = await createMatch(tournamentId, payload);
      toast.success("Match created successfully");
      onCreated(created);
    } catch (err: any) {
      toast.error(err?.response?.data?.errors || "Failed to create match");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerSearch = async (q: string) => {
    console.log("Searching:", q);
    const results = await searchPlayers(tournamentId, q);
    console.log("API Results:", results);
    return results.map((p) => ({ id: p.id, label: p.name }));
  };

  const handleTeamSearch = async (q: string) => {
    const results = await searchTeams(q);
    return results.map((t) => ({ id: t.teamId, label: t.teamName }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Create Match
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Match Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Match Type
            </label>
            <div className="flex gap-2">
              {(["player", "team"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMatchType(type)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors capitalize ${
                    matchType === type
                      ? "bg-ktsa-accent text-black border-ktsa-accent"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type === "player" ? "Singles (Players)" : "Teams"}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Stage
            </label>
            <select
              required
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
            >
              <option value="" disabled>
                Select stage
              </option>
              {STAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Status
            </label>
            <select
              required
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Round Number */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Round Number
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.roundNumber}
              onChange={(e) =>
                setForm({ ...form, roundNumber: parseInt(e.target.value) })
              }
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
            />
          </div>

          {/* Scheduled At */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Scheduled At
            </label>
            <input
              type="text"
              placeholder="e.g. 2026-07-01 15:00"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
            />
          </div>

          {/* Players or Teams */}
          {matchType === "player" ? (
            <>
              <SearchInput
                label="Player One"
                placeholder="Search player by name..."
                value={playerOneLabel}
                selectedId={form.playerOne ?? null}
                onSearch={handlePlayerSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, playerOne: id });
                  setPlayerOneLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, playerOne: null });
                  setPlayerOneLabel("");
                }}
              />
              <SearchInput
                label="Player Two"
                placeholder="Search player by name..."
                value={playerTwoLabel}
                selectedId={form.playerTwo ?? null}
                onSearch={handlePlayerSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, playerTwo: id });
                  setPlayerTwoLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, playerTwo: null });
                  setPlayerTwoLabel("");
                }}
              />
            </>
          ) : (
            <>
              <SearchInput
                label="Team One"
                placeholder="Search team by name..."
                value={teamOneLabel}
                selectedId={form.teamOne ?? null}
                onSearch={handleTeamSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, teamOne: id });
                  setTeamOneLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, teamOne: null });
                  setTeamOneLabel("");
                }}
              />
              <SearchInput
                label="Team Two"
                placeholder="Search team by name..."
                value={teamTwoLabel}
                selectedId={form.teamTwo ?? null}
                onSearch={handleTeamSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, teamTwo: id });
                  setTeamTwoLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, teamTwo: null });
                  setTeamTwoLabel("");
                }}
              />
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Create Match
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── EditMatchModal ────────────────────────────────────────────────────────────

interface EditMatchModalProps {
  match: MatchResponseDto;
  tournamentId: number;
  onClose: () => void;
  onUpdated: (match: MatchResponseDto) => void;
}

const EditMatchModal: React.FC<EditMatchModalProps> = ({
  match,
  tournamentId,
  onClose,
  onUpdated,
}) => {
  const [form, setForm] = useState<MatchUpdateDto>({
    teamOneScore: match.teamOneScore ?? 0,
    teamTwoScore: match.teamTwoScore ?? 0,
    status: match.status,
    winnerPlayer: null,
    winnerTeam: null,
  });
  const [winnerPlayerLabel, setWinnerPlayerLabel] = useState("");
  const [winnerTeamLabel, setWinnerTeamLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isTeamMatch = !!match.teamOne;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updateMatch(match.id, form);
      toast.success("Match updated successfully");
      onUpdated(updated);
    } catch (err: any) {
      toast.error(err?.response?.data?.errors || "Failed to update match");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerSearch = async (q: string) => {
    const results = await searchPlayers(tournamentId, q);
    return results.map((p) => ({ id: p.id, label: p.name }));
  };

  const handleTeamSearch = async (q: string) => {
    const results = await searchTeams(q);
    return results.map((t) => ({ id: t.teamId, label: t.teamName }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Edit Match
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isTeamMatch
                ? `${match.teamOne} vs ${match.teamTwo}`
                : `${match.playerOne} vs ${match.playerTwo}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
            >
              {STATUS_EDIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                {isTeamMatch ? match.teamOne : match.playerOne} Score
              </label>
              <input
                type="number"
                min={0}
                value={form.teamOneScore ?? 0}
                onChange={(e) =>
                  setForm({ ...form, teamOneScore: parseInt(e.target.value) })
                }
                className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                {isTeamMatch ? match.teamTwo : match.playerTwo} Score
              </label>
              <input
                type="number"
                min={0}
                value={form.teamTwoScore ?? 0}
                onChange={(e) =>
                  setForm({ ...form, teamTwoScore: parseInt(e.target.value) })
                }
                className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors"
              />
            </div>
          </div>

          {/* Winner */}
          {isTeamMatch ? (
            <SearchInput
              label="Winner Team (optional)"
              placeholder="Search winner team..."
              value={winnerTeamLabel}
              selectedId={form.winnerTeam ?? null}
              onSearch={handleTeamSearch}
              onSelect={(id, label) => {
                setForm({ ...form, winnerTeam: id });
                setWinnerTeamLabel(label);
              }}
              onClear={() => {
                setForm({ ...form, winnerTeam: null });
                setWinnerTeamLabel("");
              }}
            />
          ) : (
            <SearchInput
              label="Winner Player (optional)"
              placeholder="Search winner player..."
              value={winnerPlayerLabel}
              selectedId={form.winnerPlayer ?? null}
              onSearch={handlePlayerSearch}
              onSelect={(id, label) => {
                setForm({ ...form, winnerPlayer: id });
                setWinnerPlayerLabel(label);
              }}
              onClear={() => {
                setForm({ ...form, winnerPlayer: null });
                setWinnerPlayerLabel("");
              }}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Status & Stage Helpers ────────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "in_progress":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "completed":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const formatStatus = (status: string) =>
  status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatStage = (stage: string) =>
  stage.replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Main Component ────────────────────────────────────────────────────────────

export const TournamentMatches: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tournamentId = Number(id);

  // Fetch tournament directly from backend — not from CMS context
  // (CMS context only has hardcoded dummy data, not real backend tournaments)
  const [tournament, setTournament] = useState<any>(null);
  const [tournamentLoading, setTournamentLoading] = useState(true);

  const [matches, setMatches] = useState<MatchResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchResponseDto | null>(
    null,
  );

  useEffect(() => {
    if (!tournamentId) return;
    // With this:
    getTournamentById(String(tournamentId))
      .then((res) => setTournament(res.data))
      .catch(() => setTournament(null))
      .finally(() => setTournamentLoading(false));
  }, [tournamentId]);

  useEffect(() => {
    if (!tournamentId) return;
    setLoading(true);
    getMatchesByTournament(tournamentId)
      .then(setMatches)
      .catch(() => toast.error("Failed to load matches"))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  if (tournamentLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-ktsa-accent" />
      </div>
    );
  }

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
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} className="mr-2" />
            Add Match
          </Button>
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-ktsa-accent" />
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No matches yet</h3>
          <p className="text-muted-foreground mb-6">
            Add matches to this tournament to get started.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} className="mr-2" />
            Add First Match
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const isTeamMatch = !!match.teamOne;
            const nameOne = isTeamMatch ? match.teamOne : match.playerOne;
            const nameTwo = isTeamMatch ? match.teamTwo : match.playerTwo;
            const scoreOne = match.teamOneScore ?? null;
            const scoreTwo = match.teamTwoScore ?? null;
            const hasScores = scoreOne !== null && scoreTwo !== null;
            const oneWins = hasScores && scoreOne > scoreTwo!;
            const twoWins = hasScores && scoreTwo! > scoreOne;

            return (
              <Card
                key={match.id}
                className="p-6 hover:border-ktsa-accent/30 transition-all"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px]">
                    {/* Round / Stage / Status */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs text-ktsa-accent font-semibold uppercase tracking-wider">
                        {formatStage(match.stage ?? "")} · Round{" "}
                        {match.roundNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(match.status)}`}
                      >
                        {formatStatus(match.status)}
                      </span>
                      {isTeamMatch && (
                        <span className="px-2 py-0.5 rounded-full text-xs border bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Teams
                        </span>
                      )}
                    </div>

                    {/* Players / Teams vs Scores */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={`font-medium ${oneWins ? "text-ktsa-primary" : "text-foreground"}`}
                        >
                          {nameOne}
                          {(match.winnerPlayer === nameOne ||
                            match.winnerTeam === nameOne) && (
                            <span className="ml-2 text-xs text-ktsa-accent">
                              🏆 Winner
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-2xl font-bold tabular-nums ${oneWins ? "text-ktsa-primary" : "text-muted-foreground"}`}
                        >
                          {scoreOne ?? "–"}
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={`font-medium ${twoWins ? "text-ktsa-primary" : "text-foreground"}`}
                        >
                          {nameTwo}
                          {(match.winnerPlayer === nameTwo ||
                            match.winnerTeam === nameTwo) && (
                            <span className="ml-2 text-xs text-ktsa-accent">
                              🏆 Winner
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-2xl font-bold tabular-nums ${twoWins ? "text-ktsa-primary" : "text-muted-foreground"}`}
                        >
                          {scoreTwo ?? "–"}
                        </span>
                      </div>
                    </div>

                    {match.scheduledAt && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Scheduled: {match.scheduledAt}
                      </p>
                    )}
                  </div>

                  {/* Edit Button */}
                  <div className="flex gap-2 self-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMatch(match)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateMatchModal
          tournamentId={tournamentId}
          onClose={() => setShowCreateModal(false)}
          onCreated={(m) => {
            setMatches((prev) => [m, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingMatch && (
        <EditMatchModal
          match={editingMatch}
          tournamentId={tournamentId}
          onClose={() => setEditingMatch(null)}
          onUpdated={(updated) => {
            setMatches((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m)),
            );
            setEditingMatch(null);
          }}
        />
      )}
    </div>
  );
};
