﻿import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { getTournamentById } from "../../services/tournamentService";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  getMatchesByTournament,
  createMatch,
  updateMatch,
  searchPlayers,
  searchTeams,
  syncCategoryFromChallonge,
  MatchResponseDto,
  MatchRequestDto,
  MatchUpdateDto,
  ChallongeSyncResult,
} from "../../services/matchService";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ ModalDropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Fully custom dropdown â€” matches the FilterDropdown style from Tournaments page

interface ModalDropdownProps {
  label: string;
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  required?: boolean;
}

const ModalDropdown: React.FC<ModalDropdownProps> = ({
  label,
  value,
  placeholder = "Selectâ€¦",
  options,
  onChange,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-all duration-200
          bg-input-background border-border text-foreground
          focus:outline-none focus:ring-2 focus:ring-ktsa-primary/50
          ${open ? "border-ktsa-accent ring-2 ring-ktsa-primary/50" : "hover:border-foreground/40"}`}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-ktsa-accent transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 top-full mt-1 left-0 right-0 bg-background border border-border rounded-lg overflow-hidden max-h-56 overflow-y-auto"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors
                ${
                  value === opt.value
                    ? "bg-ktsa-accent/15 text-ktsa-accent"
                    : "text-foreground hover:bg-ktsa-accent/20"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ Reusable SearchInput â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  selectedId: number | null;
  onSearch: (
    query: string,
  ) => Promise<{ id: number; label: string; subtitle?: string }[]>;
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
  const [results, setResults] = useState<
    { id: number; label: string; subtitle?: string }[]
  >([]);
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
              <span>{r.label}</span>
              {r.subtitle && (
                <span className="block text-xs text-muted-foreground font-mono mt-0.5">
                  Challonge: {r.subtitle}
                </span>
              )}
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

// â”€â”€â”€ CreateMatchModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface CreateMatchModalProps {
  tournamentId: number;
  category: string;
  onClose: () => void;
  onCreated: (match: MatchResponseDto) => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  tournamentId,
  category,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState<MatchRequestDto>({
    stage: "",
    scheduledAt: null,
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
        category: category,
      };
      const created = await createMatch(tournamentId, payload);
      toast.success("Match created successfully", {
        duration: 2000,
      });
      onCreated(created);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors ||
          "Failed to create match",
      );
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
    return results.map((t) => ({
      id: t.teamId,
      label: t.teamName,
      subtitle: t.challongeTeamName ?? undefined,
    }));
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
          <ModalDropdown
            label="Stage"
            value={form.stage}
            placeholder="Select stage"
            options={STAGE_OPTIONS}
            onChange={(v) => setForm({ ...form, stage: v })}
            required
          />

          {/* Status */}
          <ModalDropdown
            label="Status"
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={(v) => setForm({ ...form, status: v })}
            required
          />

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
              type="datetime-local"
              value={form.scheduledAt ?? ""}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value || null })
              }
              className="w-full py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ktsa-accent focus:border-ktsa-accent transition-colors [color-scheme:dark]"
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

// â”€â”€â”€ EditMatchModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    clearWinner: false,
  });

  // Pre-populate winner labels from the existing match so admin can see the current winner
  const [winnerPlayerLabel, setWinnerPlayerLabel] = useState(match.winnerPlayer ?? "");
  const [winnerTeamLabel, setWinnerTeamLabel] = useState(match.winnerTeam ?? "");
  const [submitting, setSubmitting] = useState(false);

  const isTeamMatch = !!match.teamOne;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updateMatch(match.id, form);
      toast.success("Match updated successfully", {
        duration: 2000,
      });
      onUpdated(updated);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors ||
          "Failed to update match",
      );
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
    return results.map((t) => ({
      id: t.teamId,
      label: t.teamName,
      subtitle: t.challongeTeamName ?? undefined,
    }));
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
          <ModalDropdown
            label="Status"
            value={form.status ?? ""}
            options={STATUS_EDIT_OPTIONS}
            onChange={(v) => setForm({ ...form, status: v })}
          />

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
            <div className="space-y-2">
              <SearchInput
                label="Winner Team (optional)"
                placeholder="Search winner team..."
                value={winnerTeamLabel}
                selectedId={form.winnerTeam ?? null}
                onSearch={handleTeamSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, winnerTeam: id, clearWinner: false });
                  setWinnerTeamLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, winnerTeam: null, clearWinner: false });
                  setWinnerTeamLabel("");
                }}
              />
              {(match.winnerTeam || form.winnerTeam) && !form.clearWinner && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, winnerTeam: null, clearWinner: true });
                    setWinnerTeamLabel("");
                  }}
                  className="text-xs text-destructive/70 hover:text-destructive transition-colors"
                >
                  ✕ Clear winner
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <SearchInput
                label="Winner Player (optional)"
                placeholder="Search winner player..."
                value={winnerPlayerLabel}
                selectedId={form.winnerPlayer ?? null}
                onSearch={handlePlayerSearch}
                onSelect={(id, label) => {
                  setForm({ ...form, winnerPlayer: id, clearWinner: false });
                  setWinnerPlayerLabel(label);
                }}
                onClear={() => {
                  setForm({ ...form, winnerPlayer: null, clearWinner: false });
                  setWinnerPlayerLabel("");
                }}
              />
              {(match.winnerPlayer || form.winnerPlayer) && !form.clearWinner && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, winnerPlayer: null, clearWinner: true });
                    setWinnerPlayerLabel("");
                  }}
                  className="text-xs text-destructive/70 hover:text-destructive transition-colors"
                >
                  ✕ Clear winner
                </button>
              )}
            </div>
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

// â”€â”€â”€ Status & Stage Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Category config â€” maps display label â†’ tournament field keys â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface CategoryConfig {
  label: string;
  challongeUrlKey: string;
  doubles: boolean;
}

const ALL_CATEGORY_CONFIGS: CategoryConfig[] = [
  { label: "Open Singles",    challongeUrlKey: "openSingleChallongeUrl", doubles: false },
  { label: "Women's Singles", challongeUrlKey: "womenSingleChallongeUrl", doubles: false },
  { label: "Men's Singles",   challongeUrlKey: "mensSingleChallongeUrl", doubles: false },
  { label: "Under 16",        challongeUrlKey: "underSixteenChallongeUrl", doubles: false },
  { label: "Above 16",        challongeUrlKey: "aboveSixteenChallongeUrl", doubles: false },
  { label: "Open Doubles",    challongeUrlKey: "openDoubleChallongeUrl", doubles: true  },
  { label: "Mixed Doubles",   challongeUrlKey: "mixedDoubleChallongeUrl", doubles: true  },
];

// enabledKey maps label â†’ the Boolean enabled field on the tournament
const ENABLED_KEY_MAP: Record<string, string> = {
  "Open Singles":    "openSingleEnabled",
  "Women's Singles": "womenSingleEnabled",
  "Men's Singles":   "mensSingleEnabled",
  "Under 16":        "underSixteenEnabled",
  "Above 16":        "aboveSixteenEnabled",
  "Open Doubles":    "openDoubleEnabled",
  "Mixed Doubles":   "mixedDoubleEnabled",
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const TournamentMatches: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tournamentId = Number(id);

  const [tournament, setTournament] = useState<any>(null);
  const [tournamentLoading, setTournamentLoading] = useState(true);

  // Category navigation â€” null = show categories grid
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);

  const [matches, setMatches] = useState<MatchResponseDto[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchResponseDto | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<ChallongeSyncResult | null>(null);

  useEffect(() => {
    if (!tournamentId) return;
    getTournamentById(String(tournamentId))
      .then((res) => setTournament(res.data))
      .catch(() => setTournament(null))
      .finally(() => setTournamentLoading(false));
  }, [tournamentId]);

  // Load matches whenever selected category changes
  useEffect(() => {
    if (!tournamentId || !selectedCategory) return;
    setMatchesLoading(true);
    getMatchesByTournament(tournamentId, selectedCategory.label)
      .then(setMatches)
      .catch(() => toast.error("Failed to load matches"))
      .finally(() => setMatchesLoading(false));
  }, [tournamentId, selectedCategory]);

  const handleSyncCategory = async () => {
    if (!selectedCategory) return;
    const challongeUrl = tournament?.[selectedCategory.challongeUrlKey];
    if (!challongeUrl) {
      toast.error(
        `No Challonge URL set for "${selectedCategory.label}". Edit the tournament to add one.`,
      );
      return;
    }
    setSyncing(true);
    try {
      const result = await syncCategoryFromChallonge(
        tournamentId,
        challongeUrl,
        selectedCategory.label,
      );
      setSyncResult(result);
      const refreshed = await getMatchesByTournament(tournamentId, selectedCategory.label);
      setMatches(refreshed);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to sync from Challonge");
    } finally {
      setSyncing(false);
    }
  };

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
          <Button onClick={() => navigate("/tournaments")}>Back to Tournaments</Button>
        </div>
      </div>
    );
  }

  // Build list of enabled categories for this tournament
  const enabledCategories = ALL_CATEGORY_CONFIGS.filter(
    (c) => tournament[ENABLED_KEY_MAP[c.label]] === true,
  );

  // â”€â”€ Tournament header (shared across both views) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const header = (
    <div className="mb-8">
      <button
        onClick={() => {
          if (selectedCategory) {
            setSelectedCategory(null);
            setMatches([]);
          } else {
            navigate("/tournaments");
          }
        }}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        {selectedCategory ? `Back to ${tournament.tournamentName || tournament.name} Categories` : "Back to Tournaments"}
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="mb-1 bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
            {tournament.tournamentName || tournament.name}
          </h1>
          {selectedCategory && (
            <p className="text-sm text-ktsa-accent font-semibold">
              {selectedCategory.label}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
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
                tournament.status === "upcoming" || tournament.status === "UPCOMING"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : tournament.status === "ongoing" || tournament.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}
            >
              {tournament.status}
            </span>
          </div>
        </div>

        {/* Category-level actions */}
        {selectedCategory && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncCategory}
              disabled={syncing}
              title={
                tournament[selectedCategory.challongeUrlKey]
                  ? `Sync "${selectedCategory.label}" from Challonge`
                  : `No Challonge URL set for "${selectedCategory.label}"`
              }
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border transition-colors
                ${tournament[selectedCategory.challongeUrlKey]
                  ? "border-ktsa-accent/50 text-ktsa-accent hover:bg-ktsa-accent/10 hover:border-ktsa-accent"
                  : "border-border text-muted-foreground/40 cursor-not-allowed"
                }
                ${syncing ? "opacity-60 cursor-wait" : ""}
              `}
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync Challonge"}
            </button>

            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="mr-2" />
              Add Match
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // â”€â”€ VIEW 1: Categories grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!selectedCategory) {
    return (
      <div className="p-2 lg:p-4 max-w-7xl mx-auto">
        {header}

        {enabledCategories.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No categories configured</h3>
            <p className="text-muted-foreground mb-6">
              Edit the tournament to enable at least one category.
            </p>
            <Button onClick={() => navigate(`/tournaments/${tournamentId}/edit`)}>
              Edit Tournament
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enabledCategories.map((cat) => {
              const hasChallonge = !!tournament[cat.challongeUrlKey];
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat)}
                  className="group text-left rounded-xl border border-border hover:border-ktsa-accent bg-card hover:bg-ktsa-accent/5 transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    {cat.doubles && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Doubles
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-ktsa-accent transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {hasChallonge ? (
                      <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={11} />Challonge URL set</span>
                    ) : (
                      <span className="text-muted-foreground/60">No Challonge URL</span>
                    )}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-ktsa-accent/70 group-hover:text-ktsa-accent transition-colors">
                    View Matches
                    <ArrowLeft size={12} className="rotate-180" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // â”€â”€ VIEW 2: Matches for selected category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      {header}

      {matchesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-ktsa-accent" />
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No matches yet</h3>
          <p className="text-muted-foreground mb-6">
            Add matches for {selectedCategory.label} to get started.
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
              <Card key={match.id} className="p-6 hover:border-ktsa-accent/30 transition-all">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs text-ktsa-accent font-semibold uppercase tracking-wider">
                        {formatStage(match.stage ?? "")} &middot; Round {match.roundNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(match.status)}`}>
                        {formatStatus(match.status)}
                      </span>
                      {isTeamMatch && (
                        <span className="px-2 py-0.5 rounded-full text-xs border bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Teams
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className={`font-medium ${oneWins ? "text-ktsa-primary" : "text-foreground"}`}>
                            {nameOne}
                            {(match.winnerPlayer === nameOne || match.winnerTeam === nameOne) && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-yellow-400"><Trophy size={12} /> Winner</span>
                            )}
                          </span>
                          {isTeamMatch && match.teamOneChallongeName && (
                            <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">
                              {match.teamOneChallongeName}
                            </p>
                          )}
                        </div>
                        <span className={`text-2xl font-bold tabular-nums ${oneWins ? "text-ktsa-primary" : "text-muted-foreground"}`}>
                          {scoreOne ?? "-"}
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className={`font-medium ${twoWins ? "text-ktsa-primary" : "text-foreground"}`}>
                            {nameTwo}
                            {(match.winnerPlayer === nameTwo || match.winnerTeam === nameTwo) && (
                              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-yellow-400"><Trophy size={12} /> Winner</span>
                            )}
                          </span>
                          {isTeamMatch && match.teamTwoChallongeName && (
                            <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">
                              {match.teamTwoChallongeName}
                            </p>
                          )}
                        </div>
                        <span className={`text-2xl font-bold tabular-nums ${twoWins ? "text-ktsa-primary" : "text-muted-foreground"}`}>
                          {scoreTwo ?? "-"}
                        </span>
                      </div>
                    </div>

                    {match.scheduledAt && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Scheduled:{" "}
                        {new Date(match.scheduledAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 self-start">
                    <Button variant="ghost" size="sm" onClick={() => setEditingMatch(match)}>
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
          category={selectedCategory.label}
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
            setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setEditingMatch(null);
          }}
        />
      )}

      {/* Challonge Sync Result Dialog */}
      {syncResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Challonge Sync Complete</h2>
              <button onClick={() => setSyncResult(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{syncResult.totalFromChallonge}</p>
                  <p className="text-xs text-muted-foreground mt-1">From Challonge</p>
                </div>
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{syncResult.created}</p>
                  <p className="text-xs text-muted-foreground mt-1">Created</p>
                </div>
                <div className="rounded-lg bg-ktsa-accent/10 border border-ktsa-accent/20 p-3 text-center">
                  <p className="text-2xl font-bold text-ktsa-accent">{syncResult.updated}</p>
                  <p className="text-xs text-muted-foreground mt-1">Updated</p>
                </div>
              </div>

              {syncResult.unmatchedParticipants.length > 0 && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-amber-400">
                      {syncResult.unmatchedParticipants.length} participant{syncResult.unmatchedParticipants.length !== 1 ? "s" : ""} couldn't be matched
                    </p>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {syncResult.unmatchedParticipants.map((name) => (
                      <li key={name} className="text-xs text-amber-300/80 font-mono">"{name}"</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2 ml-6">
                    Make sure each Challonge participant name exactly matches a local user's <span className="font-mono">userName</span>.
                  </p>
                </div>
              )}

              {syncResult.unmatchedParticipants.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">All participants matched successfully.</p>
              )}
            </div>

            <div className="px-6 pb-6">
              <Button className="w-full" onClick={() => setSyncResult(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
