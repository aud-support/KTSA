import React, { useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { bulkImportUsers } from "../../services/userService";

interface ImportResult {
  totalRows: number;
  created: number;
  skipped: number;
  skippedEmails: string[];
}

export const BulkImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setError("Only .xlsx files are supported.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setError("Only .xlsx files are supported.");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await bulkImportUsers(selectedFile);
      setResult(response.data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">
          Bulk Import{" "}
          <span className="bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
            Players
          </span>
        </h1>
        <p className="text-muted-foreground">
          Upload an Excel file to create multiple player accounts at once.
          All imported players will have the default password:{" "}
          <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-ktsa-primary">
            Ktsa@1234
          </code>
        </p>
      </div>

      {/* Template Info */}
      <Card className="mb-6 border-ktsa-accent/30 bg-gradient-to-r from-ktsa-secondary/5 to-ktsa-accent/5">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-ktsa-accent mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm mb-1">Excel File Format</p>
            <p className="text-sm text-muted-foreground mb-2">
              Your file must have these columns in order (row 1 = headers, data starts row 2):
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { col: "A", label: "name", required: true },
                { col: "B", label: "email", required: true },
                { col: "C", label: "gender", required: false, note: "MALE or FEMALE" },
              ].map((c) => (
                <div key={c.col} className="bg-muted/50 rounded p-2 border border-border">
                  <span className="font-mono font-bold text-ktsa-primary">Column {c.col}</span>
                  <p className="mt-0.5 font-medium">{c.label}</p>
                  <p className="text-muted-foreground">
                    {c.required ? "Required" : `Optional${c.note ? ` — ${c.note}` : ""}`}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rows with duplicate emails are automatically skipped.
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Zone */}
      {!result && (
        <Card className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${selectedFile
                ? "border-ktsa-primary/60 bg-ktsa-primary/5"
                : "border-border hover:border-ktsa-primary/40 hover:bg-muted/30"
              }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileSpreadsheet size={40} className="text-ktsa-primary" />
                <p className="font-medium text-ktsa-primary">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB — click to change
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={40} className="text-muted-foreground" />
                <p className="font-medium">Drop your Excel file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">.xlsx files only</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
              <XCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || loading}
              className="flex-1"
            >
              {loading ? "Importing..." : "Import Players"}
            </Button>
            {selectedFile && (
              <Button variant="ghost" onClick={handleReset}>
                Clear
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="border-ktsa-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-500" />
            <h3 className="font-semibold text-lg">Import Complete</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-ktsa-primary">{result.totalRows}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Rows</p>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">{result.created}</p>
              <p className="text-xs text-muted-foreground mt-1">Created</p>
            </div>
            <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-500">{result.skipped}</p>
              <p className="text-xs text-muted-foreground mt-1">Skipped</p>
            </div>
          </div>

          {result.skippedEmails.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 text-yellow-500">
                Skipped ({result.skippedEmails.length}) — already exist or invalid:
              </p>
              <div className="bg-muted/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                {result.skippedEmails.map((email) => (
                  <p key={email} className="text-xs text-muted-foreground py-0.5 font-mono">
                    {email}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button className="mt-4 w-full" variant="ghost" onClick={handleReset}>
            Import Another File
          </Button>
        </Card>
      )}
    </div>
  );
};
