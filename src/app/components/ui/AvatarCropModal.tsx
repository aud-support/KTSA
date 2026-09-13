import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { motion } from "motion/react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, AlertCircle } from "lucide-react";

interface Props {
  imageSrc: string;
  userId: number;
  onCancel: () => void;
  /** Called after a successful upload with the final preview URL */
  onSaved: (previewUrl: string, persistedUrl?: string) => void;
}

// ── Utility: crop the image using a canvas ────────────────────────────────────
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
): Promise<Blob> {
  const image = await createImageBitmap(
    await fetch(imageSrc).then((r) => r.blob()),
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  // Rotate around center
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width / 2,
    safeArea / 2 - image.height / 2,
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y),
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.85,
    );
  });
}

type Status = "idle" | "cropping" | "uploading" | "success" | "error";

export default function AvatarCropModal({ imageSrc, userId, onCancel, onSaved }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // ── Apply: crop → upload → notify parent ─────────────────────────────────
  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setErrorMsg("");

    // Guard: no token means we'll definitely get a 401
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("You are not logged in. Please log out and log back in, then try again.");
      return;
    }

    setStatus("cropping");

    let blob: Blob;
    let localPreview: string;

    // Step 1 — generate cropped blob
    try {
      blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      localPreview = URL.createObjectURL(blob);
    } catch {
      setStatus("error");
      setErrorMsg("Failed to process the image. Please try another photo.");
      return;
    }

    // Step 2 — upload to backend
    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("avatar", blob, "avatar.jpg");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${userId}/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (res.status === 401) {
          throw new Error("Session expired. Please log out and log back in, then try again.");
        }
        throw new Error(errData?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json().catch(() => null);
      const persistedUrl: string | undefined = data?.data?.profilePictureUrl;

      setStatus("success");

      // Brief success flash, then close
      setTimeout(() => {
        onSaved(localPreview, persistedUrl);
      }, 600);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    }
  };

  const isProcessing = status === "cropping" || status === "uploading";

  const applyLabel =
    status === "cropping"
      ? "Processing…"
      : status === "uploading"
        ? "Uploading…"
        : status === "success"
          ? "Saved!"
          : "Apply";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="w-full max-w-sm bg-black/90 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-bold text-base">Adjust Photo</h3>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full" style={{ height: 280 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-5 pt-4 pb-5 space-y-4">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              disabled={isProcessing}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-ktsa-primary cursor-pointer disabled:opacity-40"
              aria-label="Zoom level"
            />
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Rotation */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Rotate</span>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-xs font-medium hover:border-gray-500 hover:text-white transition-colors disabled:opacity-40"
              aria-label="Rotate 90 degrees"
            >
              <RotateCw size={14} />
              90°
            </button>
          </div>

          {/* Error message */}
          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:border-gray-400 hover:text-white transition-all disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isProcessing || status === "success"}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60
                ${status === "success"
                  ? "bg-green-500/70 text-white"
                  : "bg-ktsa-primary/70 text-ktsa-text hover:bg-ktsa-primary/60"
                }`}
            >
              {isProcessing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : status === "success" ? (
                <Check size={15} />
              ) : null}
              {applyLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
