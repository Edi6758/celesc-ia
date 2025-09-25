import { ReadingEvidence } from "../_types/reading";
import { mockInvoices } from "./invoices";

const photoQualities = ["GOOD", "BLURRY", "DARK", "OBSTRUCTED"] as const;

function generateRandomEvidence(invoiceId: string, index: number): ReadingEvidence {
  const invoice = mockInvoices.find(inv => inv.id === invoiceId);
  const photoQuality = photoQualities[Math.floor(Math.random() * photoQualities.length)];
  const ocrDigits = String(invoice?.currentReading || 0).padStart(7, '0');

  const expectedSerial = `MTR${Math.floor(Math.random() * 9000) + 1000}`;
  const meterSerialOCR = Math.random() > 0.1 ? expectedSerial : `MTR${Math.floor(Math.random() * 9000) + 1000}`;

  const lat = -25.4284 + (Math.random() - 0.5) * 0.5; // Around Curitiba area
  const lng = -49.2733 + (Math.random() - 0.5) * 0.5;

  const validations = [
    {
      type: "GEOFENCE" as const,
      ok: Math.random() > 0.05 // 95% success rate
    },
    {
      type: "SERIAL_MATCH" as const,
      ok: meterSerialOCR === expectedSerial
    },
    {
      type: "OCR_CONFIDENCE" as const,
      ok: photoQuality === "GOOD" ? Math.random() > 0.1 : Math.random() > 0.4,
      confidence: photoQuality === "GOOD" ? 0.85 + Math.random() * 0.14 : 0.4 + Math.random() * 0.4
    }
  ];

  return {
    id: `EVD-${String(index + 1).padStart(4, '0')}`,
    invoiceId,
    photoUrl: `https://picsum.photos/400/300?random=${index + 1}`,
    ocrDigits,
    meterSerialOCR,
    expectedMeterSerial: expectedSerial,
    geo: {
      lat,
      lng,
      accuracyM: Math.floor(Math.random() * 10) + 2
    },
    photoQuality,
    takenAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    validations
  };
}

export const mockReadings: ReadingEvidence[] = mockInvoices
  .filter(invoice => invoice.status === "CRITICAL")
  .map((invoice, index) => generateRandomEvidence(invoice.id, index));