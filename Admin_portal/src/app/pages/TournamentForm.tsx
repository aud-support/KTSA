import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Textarea, Select } from "../components/Input";
import { useCMS, Tournament, defaultCategories } from "../context/CMSContext";
import {
  createTournament,
  updateTournament,
  getTournamentById,
} from "../../services/tournamentService";

export const TournamentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const {} = useCMS();

  const isEdit = !!id;
  // const existingTournament = isEdit
  //   ? tournaments.find((t) => t.id === id)
  //   : null;

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    format: "",
    status: "",
    venue: "",
    maxParticipants: "",
    pricePool: "",
    challengeBracketUrl: "",
    description: "",
    registrationClosed: false,
    categories: structuredClone(defaultCategories),
  });

  // Banner image state
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null,
  );
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      try {
        const response = await getTournamentById(id);

        const tournament = response.data;

        // Helper to split a datetime string (ISO or "YYYY-MM-DD HH:mm") into date + time parts
        const splitDateTime = (dt: string) => {
          if (!dt) return { date: "", time: "" };
          // ISO: "2026-06-11T09:00:00" → date="2026-06-11", time="09:00"
          // plain date: "2026-06-11" → date="2026-06-11", time=""
          const [datePart, timePart] = dt.split("T");
          const date = datePart || "";
          const time = timePart ? timePart.slice(0, 5) : "";
          return { date, time };
        };

        const start = splitDateTime(tournament.startDate);
        const end = splitDateTime(tournament.endDate);

        setFormData({
          name: tournament.tournamentName,
          startDate: start.date,
          startTime: start.time,
          endDate: end.date,
          endTime: end.time,
          format: tournament.format,
          status: tournament.status,
          venue: tournament.venue,

          maxParticipants: tournament.maxParticipants?.toString() || "",

          pricePool: tournament.pricePool?.toString() || "",

          challengeBracketUrl: "",

          description: tournament.description,

          registrationClosed: tournament.registrationClosed ?? false,

          categories: {
            openSingle: {
              enabled: tournament.openSingleEnabled ?? false,
              fee: tournament.openSingleFee?.toString() || "",
            },

            openDouble: {
              enabled: tournament.openDoubleEnabled ?? false,
              fee: tournament.openDoubleFee?.toString() || "",
            },

            mixedDouble: {
              enabled: tournament.mixedDoubleEnabled ?? false,
              fee: tournament.mixedDoubleFee?.toString() || "",
            },

            womenSingle: {
              enabled: tournament.womenSingleEnabled ?? false,
              fee: tournament.womenSingleFee?.toString() || "",
            },
          },
        });

        // Pre-populate preview with existing banner URL from DB
        if (tournament.bannerUrl) {
          setBannerImagePreview(tournament.bannerUrl);
        }
      } catch (error) {
        toast.error("Failed to load tournament");
      }
    };

    fetchTournament();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Store the File object for upload, and generate a local preview URL
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2MB validation
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (file.size > maxSize) {
      toast.error("Banner image must be less than 2MB");

      // reset file input
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }

      return;
    }

    // Revoke previous blob URL to avoid memory leaks
    if (bannerImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerImagePreview);
    }

    setBannerImage(file);
    setBannerImagePreview(URL.createObjectURL(file)); // just for preview
  };

  const handleRemoveBanner = () => {
    if (bannerImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerImagePreview);
    }
    setBannerImage(null);
    setBannerImagePreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const handleCategoryToggle = (category: keyof typeof formData.categories) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          enabled: !prev.categories[category].enabled,

          // clear fee if unchecked
          fee: prev.categories[category].enabled
            ? ""
            : prev.categories[category].fee,
        },
      },
    }));
  };

  const handleCategoryFeeChange = (
    category: keyof typeof formData.categories,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          fee: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tournamentData = {
      tournamentName: formData.name,
      description: formData.description,

      format: formData.format,
      status: formData.status,

      startDate: formData.startTime
        ? `${formData.startDate}T${formData.startTime}:00`
        : formData.startDate,
      endDate: formData.endTime
        ? `${formData.endDate}T${formData.endTime}:00`
        : formData.endDate,

      venue: formData.venue,

      pricePool: Number(formData.pricePool) || 0,

      maxParticipants: Number(formData.maxParticipants) || 0,

      openSingleEnabled: formData.categories.openSingle.enabled,

      openSingleFee: formData.categories.openSingle.enabled
        ? Number(formData.categories.openSingle.fee)
        : null,

      openDoubleEnabled: formData.categories.openDouble.enabled,

      openDoubleFee: formData.categories.openDouble.enabled
        ? Number(formData.categories.openDouble.fee)
        : null,

      mixedDoubleEnabled: formData.categories.mixedDouble.enabled,

      mixedDoubleFee: formData.categories.mixedDouble.enabled
        ? Number(formData.categories.mixedDouble.fee)
        : null,

      womenSingleEnabled: formData.categories.womenSingle.enabled,

      womenSingleFee: formData.categories.womenSingle.enabled
        ? Number(formData.categories.womenSingle.fee)
        : null,

      registrationClosed: formData.registrationClosed,
    };

    // Build multipart payload
    const payload = new FormData();
    payload.append(
      "data",
      new Blob([JSON.stringify(tournamentData)], { type: "application/json" }),
    );
    if (bannerImage) {
      payload.append("banner", bannerImage);
    }

    try {
      if (isEdit && id) {
        await updateTournament(id, payload);

        toast.success("Tournament updated successfully!");
      } else {
        await createTournament(payload);

        toast.success("Tournament created successfully!");
      }

      navigate("/tournaments");
    } catch (error) {
      console.error(error);

      toast.error("Failed to save tournament");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/tournaments")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="mb-2">
          {isEdit ? (
            <>
              Edit Tournament:{" "}
              <span className="bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
                {formData.name}
              </span>
            </>
          ) : (
            "Create Tournament"
          )}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? `Modify the details for ${formData.name}`
            : "Add a new tournament entry"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tournament Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Bengaluru Open 2026"
                required
              />
              <Input
                label="Venue *"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Koramangala Indoor Stadium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-foreground">
                  Start Date & Time *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-foreground">
                  End Date & Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                  <Input
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    placeholder="HH:MM"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                options={[
                  // <option value="">Select an option</option>
                  { value: "Select an Format", label: "Select an Format" },
                  { value: "SINGLE_ELIMINATION", label: "Single Elimination" },
                  { value: "DOUBLE_ELIMINATION", label: "Double Elimination" },
                  { value: "ROUND_ROBIN", label: "Round Robin" },
                  { value: "LEAGUE", label: "League" },
                  { value: "SWISS_SYSTEM", label: "Swiss System" },
                ]}
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "Select an Status", label: "Select an Status" },
                  { value: "UPCOMING", label: "Upcoming" },
                  { value: "ACTIVE", label: "Ongoing" },
                  { value: "COMPLETED", label: "Completed" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Max Participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="e.g. 16"
                min={1}
              />
              <Input
                label="Prize Pool (₹)"
                name="pricePool"
                value={formData.pricePool}
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
                Tournament Categories
              </h3>

              <div className="space-y-4">
                {[
                  {
                    key: "openSingle",
                    label: "Open Single",
                  },
                  {
                    key: "openDouble",
                    label: "Open Double",
                  },
                  {
                    key: "mixedDouble",
                    label: "Mixed Double",
                  },
                  {
                    key: "womenSingle",
                    label: "Women Single",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col md:flex-row md:items-center gap-2 rounded-lg"
                  >
                    <label className="flex items-center gap-3 min-w-[180px]">
                      <input
                        type="checkbox"
                        checked={
                          formData.categories[
                            item.key as keyof typeof formData.categories
                          ].enabled
                        }
                        onChange={() =>
                          handleCategoryToggle(
                            item.key as keyof typeof formData.categories,
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span>{item.label}</span>
                    </label>

                    <div className="flex-1">
                      <Input
                        // label="Entry Fee (₹)"
                        type="number"
                        min={1}
                        placeholder="Enter fee"
                        disabled={
                          !formData.categories[
                            item.key as keyof typeof formData.categories
                          ].enabled
                        }
                        value={
                          formData.categories[
                            item.key as keyof typeof formData.categories
                          ].fee
                        }
                        onChange={(e) =>
                          handleCategoryFeeChange(
                            item.key as keyof typeof formData.categories,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <Input
              label="Challonge Bracket URL"
              name="challengeBracketUrl"
              value={formData.challengeBracketUrl}
              onChange={handleChange}
              placeholder="https://challonge.com/..."
            /> */}

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tournament description, rules, format details..."
              rows={4}
            />

            <div>
              <label className="block text-sm font-medium mb-3">
                Tournament Banner
              </label>

              {bannerImagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-card">
                  <img
                    src={bannerImagePreview}
                    alt="Banner Preview"
                    className="w-full h-56 object-cover"
                  />

                  {/* top actions */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-2 text-sm rounded-lg text-ktsa-highlight bg-background/80 backdrop-blur border border-border hover:bg-background transition"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="p-2 rounded-lg bg-background/80 text-ktsa-highlight backdrop-blur border border-border hover:bg-background transition"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* footer info */}
                  <div className="p-3 border-t border-border bg-background/50">
                    <p className="text-sm font-medium">
                      {bannerImage?.name || "Current Tournament Banner"}
                    </p>

                    {bannerImage && (
                      <p className="text-xs text-muted-foreground">
                        {(bannerImage.size / 1024).toFixed(0)} KB
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="
        w-full rounded-xl border-2 border-dashed border-border
        hover:border-ktsa-primary transition-all
        bg-card px-6 py-10
        flex flex-col items-center justify-center
        text-center group
      "
                >
                  <div className="rounded-full p-4 bg-muted mb-4 group-hover:scale-105 transition">
                    <UploadCloud size={28} />
                  </div>

                  <h3 className="font-medium">Upload Tournament Banner</h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Click to upload PNG, JPG or WEBP
                  </p>

                  <span className="text-xs text-muted-foreground mt-2">
                    Recommended: 1200 × 500px · Max 2MB
                  </span>
                </button>
              )}

              {/* hidden input */}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleBannerChange}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/tournaments")}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Save Changes" : "Create Tournament"}
          </Button>
        </div>
      </form>
    </div>
  );
};
