export interface ReadingEvidence {
  id: string;
  invoiceId: string;
  photoUrl: string; // usar placeholder
  ocrDigits: string; // ex.: "0003456"
  meterSerialOCR?: string;
  expectedMeterSerial?: string;
  geo: { lat: number; lng: number; accuracyM: number };
  photoQuality: "GOOD" | "BLURRY" | "DARK" | "OBSTRUCTED";
  takenAt: string;
  validations: Array<
    | { type: "GEOFENCE"; ok: boolean }
    | { type: "SERIAL_MATCH"; ok: boolean }
    | { type: "OCR_CONFIDENCE"; ok: boolean; confidence: number }
  >;
}