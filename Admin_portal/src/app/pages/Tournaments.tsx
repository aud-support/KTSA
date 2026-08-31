import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Trophy,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  LockOpen,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  getAllTournaments,
  getTournamentsByFilter,
  getAvailableYears,
  deleteTournament as deleteTournamentAPI,
  setRegistrationClosed,
  exportRegistrations,
} from "../../services/tournamentService";

// ─── Types ────────────────────────────────────────────────────────────────────

type TournamentStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

interface Tournament {
  id: string | number;
  tournamentName: string;
  startDate: string;
  registrationClosed?: boolean;
  endDate: string;
  status: TournamentStatus;
  format: string;
  venue: string;
  pricePool?: number;
}

// ─── Status helpers ────────────────────────────────────────────────────────────

function deriveStatus(t: Tournament): TournamentStatus {
  const now = Date.now();
  const start = new Date(
    t.startDate.includes("T") ? t.startDate : t.startDate + "T00:00:00",
  ).getTime();
  const end = new Date(
    t.endDate.includes("T") ? t.endDate : t.endDate + "T23:59:59",
  ).getTime();

  if (t.status === "ACTIVE" || t.status === "LIVE") return "LIVE";
  if (t.status === "COMPLETED") return "COMPLETED";
  if (t.status === "CANCELLED") return "CANCELLED";
  if (now >= start && now <= end) return "LIVE";
  if (now > end) return "COMPLETED";
  return "UPCOMING";
}

function getStatusColor(status: TournamentStatus) {
  switch (status) {
    case "UPCOMING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "ACTIVE":
    case "LIVE":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "COMPLETED":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function statusLabel(status: TournamentStatus) {
  switch (status) {
    case "LIVE":
    case "ACTIVE":
      return "Live";
    case "UPCOMING":
      return "Upcoming";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

type StatusFilter = "ALL" | "UPCOMING" | "LIVE" | "COMPLETED";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Live", value: "LIVE" },
  { label: "Completed", value: "COMPLETED" },
];

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const PAGE_SIZE = 10;

// ─── Reusable Filter Dropdown ─────────────────────────────────────────────────

function FilterDropdown({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: { label: string; value: string | number }[];
  onSelect: (v: any) => void;
}) {
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

  const isActive = value !== "";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border font-semibold transition-colors min-w-[120px] justify-between
          ${
            isActive
              ? "border-ktsa-accent text-ktsa-accent bg-ktsa-accent/10"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground bg-background"
          }`}
      >
        <span>{label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 bg-background border border-border rounded-md overflow-hidden min-w-[140px] max-h-64 overflow-y-auto"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                value === String(opt.value)
                  ? "bg-ktsa-accent/15 text-ktsa-accent"
                  : "text-foreground hover:bg-muted/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Tournaments: React.FC = () => {
  const navigate = useNavigate();

  // All tournaments fetched (respects date filter, paginated client-side for status)
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch available years once on mount
  useEffect(() => {
    getAvailableYears()
      .then(setAvailableYears)
      .catch(() => {});
  }, []);

  // Fetch tournaments when date filters change — reset to page 1
  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    const fetchFn =
      selectedMonth != null || selectedYear != null
        ? getTournamentsByFilter(selectedMonth, selectedYear)
        : getAllTournaments();

    fetchFn
      .then((res: any) => {
        const raw: Tournament[] = res.data?.content ?? res.data ?? [];
        setAllTournaments(raw.map((t) => ({ ...t, status: deriveStatus(t) })));
      })
      .catch(() => toast.error("Failed to load tournaments"))
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  // ── Client-side status filter ──
  const filtered =
    statusFilter === "ALL"
      ? allTournaments
      : statusFilter === "LIVE"
        ? allTournaments.filter(
            (t) => t.status === "LIVE" || t.status === "ACTIVE",
          )
        : allTournaments.filter((t) => t.status === statusFilter);

  const counts: Record<StatusFilter, number> = {
    ALL: allTournaments.length,
    UPCOMING: allTournaments.filter((t) => t.status === "UPCOMING").length,
    LIVE: allTournaments.filter(
      (t) => t.status === "LIVE" || t.status === "ACTIVE",
    ).length,
    COMPLETED: allTournaments.filter((t) => t.status === "COMPLETED").length,
  };

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Reset page when status filter changes
  const handleStatusChange = (v: StatusFilter) => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  const hasAnyFilter =
    statusFilter !== "ALL" || selectedMonth != null || selectedYear != null;

  const handleClearAll = () => {
    setStatusFilter("ALL");
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await deleteTournamentAPI(id);
        setAllTournaments((prev) => prev.filter((t) => String(t.id) !== id));
        toast.success("Tournament deleted successfully!", {
          duration: 2000,
        });
      } catch {
        toast.error("Failed to delete tournament");
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleToggleRegistration = async (
    id: string,
    currentlyClosed: boolean,
  ) => {
    try {
      await setRegistrationClosed(id, !currentlyClosed);
      setAllTournaments((prev) =>
        prev.map((t) =>
          String(t.id) === id
            ? { ...t, registrationClosed: !currentlyClosed }
            : t,
        ),
      );
      toast.success(
        !currentlyClosed ? "Registration closed." : "Registration reopened.",
        {
          duration: 2000,
        },
      );
    } catch {
      toast.error("Failed to update registration status");
    }
  };

  const handleExport = async (id: string, tournamentName: string) => {
    setExportingId(id);
    try {
      const blob = await exportRegistrations(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tournamentName.replace(/\s+/g, "_")}_registrations.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Registrations exported successfully!", {
        duration: 2000,
      });
    } catch (err: any) {
      const msg =
        err?.response?.status === 400
          ? "Registration must be closed before exporting."
          : "Failed to export registrations.";
      toast.error(msg);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 ">
        {/* Status */}
        <FilterDropdown
          label={
            statusFilter === "ALL"
              ? "All Status"
              : `${STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label} (${counts[statusFilter]})`
          }
          value={statusFilter}
          options={STATUS_OPTIONS.map((s) => ({
            ...s,
            label: `${s.label}${s.value !== "ALL" ? ` (${counts[s.value as StatusFilter]})` : ""}`,
          }))}
          onSelect={handleStatusChange}
        />

        {/* Month */}
        <FilterDropdown
          label={
            selectedMonth
              ? MONTHS.find((m) => m.value === selectedMonth)!.label
              : "All Months"
          }
          value={selectedMonth != null ? String(selectedMonth) : ""}
          options={[{ label: "All Months", value: "" }, ...MONTHS]}
          onSelect={(v) => {
            setSelectedMonth(v === "" ? undefined : Number(v));
            setCurrentPage(1);
          }}
        />

        {/* Year */}
        <FilterDropdown
          label={selectedYear ? String(selectedYear) : "All Years"}
          value={selectedYear != null ? String(selectedYear) : ""}
          options={[
            { label: "All Years", value: "" },
            ...availableYears.map((y) => ({ label: String(y), value: y })),
          ]}
          onSelect={(v) => {
            setSelectedYear(v === "" ? undefined : Number(v));
            setCurrentPage(1);
          }}
        />

        {/* Clear */}
        {hasAnyFilter && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1.5 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}

        {/* Results count */}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} tournament{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
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
                  Date
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
                <th className="px-6 py-2 text-sm text-muted-foreground uppercase tracking-wider">
                  Export
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                : paginated.map((tournament) => (
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
                        <div>
                          {new Date(tournament.startDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground/70">
                          {new Date(tournament.startDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(tournament.status)}`}
                        >
                          {statusLabel(tournament.status)}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-sm text-muted-foreground">
                        {tournament.format?.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-2 text-sm text-muted-foreground">
                        {tournament.venue || "—"}
                      </td>
                      <td className="px-6 py-2 text-sm text-muted-foreground">
                        {tournament.pricePool
                          ? `₹${tournament.pricePool}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <button
                            onClick={() =>
                              navigate(`/tournaments/${tournament.id}/edit`)
                            }
                            className="text-ktsa-primary hover:text-ktsa-highlight transition-colors text-sm"
                          >
                            Edit
                          </button>
                          {tournament.status === "UPCOMING" && (
                            <button
                              onClick={() =>
                                handleToggleRegistration(
                                  String(tournament.id),
                                  !!tournament.registrationClosed,
                                )
                              }
                              title={
                                tournament.registrationClosed
                                  ? "Reopen Registration"
                                  : "Close Registration"
                              }
                              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                                tournament.registrationClosed
                                  ? "text-amber-400 hover:text-amber-300"
                                  : "text-green-400 hover:text-green-300"
                              }`}
                            >
                              {tournament.registrationClosed ? (
                                <>
                                  <Lock size={12} /> Closed
                                </>
                              ) : (
                                <>
                                  <LockOpen size={12} /> Open
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(String(tournament.id))}
                            className={`transition-colors text-sm ${
                              deleteConfirm === String(tournament.id)
                                ? "text-destructive font-semibold"
                                : "text-destructive/70 hover:text-destructive"
                            }`}
                          >
                            {deleteConfirm === String(tournament.id)
                              ? "Confirm?"
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleExport(
                              String(tournament.id),
                              tournament.tournamentName,
                            )
                          }
                          disabled={exportingId === String(tournament.id)}
                          title={
                            tournament.registrationClosed
                              ? "Download Registrations"
                              : "Close registration first to export"
                          }
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors
                            ${
                              tournament.registrationClosed
                                ? "border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
                                : "border-border text-muted-foreground/40 cursor-not-allowed"
                            }
                            ${exportingId === String(tournament.id) ? "opacity-60 cursor-wait" : ""}
                          `}
                        >
                          <Download size={12} />
                          {exportingId === String(tournament.id)
                            ? "Exporting…"
                            : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="lg:hidden divide-y divide-border">
          {paginated.map((tournament) => (
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
                      className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getStatusColor(tournament.status)}`}
                    >
                      {statusLabel(tournament.status)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {new Date(tournament.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
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
                {tournament.status === "UPCOMING" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleRegistration(
                        String(tournament.id),
                        !!tournament.registrationClosed,
                      )
                    }
                    className={
                      tournament.registrationClosed
                        ? "text-amber-400"
                        : "text-green-400"
                    }
                  >
                    {tournament.registrationClosed ? (
                      <>
                        <Lock size={12} className="mr-1" />
                        Closed
                      </>
                    ) : (
                      <>
                        <LockOpen size={12} className="mr-1" />
                        Open
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(String(tournament.id))}
                >
                  {deleteConfirm === String(tournament.id)
                    ? "Confirm?"
                    : "Delete"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleExport(
                      String(tournament.id),
                      tournament.tournamentName,
                    )
                  }
                  disabled={
                    !tournament.registrationClosed ||
                    exportingId === String(tournament.id)
                  }
                  className={
                    tournament.registrationClosed
                      ? "text-blue-400 border-blue-500/30"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  }
                >
                  <Download size={12} className="mr-1" />
                  {exportingId === String(tournament.id)
                    ? "Exporting…"
                    : "Download"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No tournaments found</h3>
            <p className="text-muted-foreground mb-6">
              {hasAnyFilter
                ? "No tournaments match the selected filters."
                : "Create your first tournament to get started."}
            </p>
            {!hasAnyFilter && (
              <Button onClick={() => navigate("/tournaments/new")}>
                <Plus size={20} className="mr-2" />
                Create Tournament
              </Button>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages} · {filtered.length} total
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (
                    idx > 0 &&
                    typeof arr[idx - 1] === "number" &&
                    (p as number) - (arr[idx - 1] as number) > 1
                  ) {
                    acc.push("…");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`min-w-[28px] h-7 text-xs rounded border transition-colors ${
                        currentPage === p
                          ? "border-ktsa-accent bg-ktsa-accent/10 text-ktsa-accent font-semibold"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
