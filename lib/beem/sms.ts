export const TANZANIA_PHONE_REGEX = /^\+255[67]\d{8}$/;

export function isValidTanzaniaPhone(phone: string): boolean {
  return /^\+255\d{9}$/.test(phone.trim());
}

export function normalizeToBeemRecipient(phone: string): string {
  // Beem Africa expects 255XXXXXXXXX without the leading '+'
  return phone.trim().replace(/^\+/, "");
}

export interface InvoiceSmsTemplateParams {
  parentName: string;
  pupilName: string;
  amount: number;
  invoiceNo: string;
  dueDate: string;
}

export interface BroadcastSmsTemplateParams {
  parentName?: string;
  subject: string;
  messageBody: string;
}

export function buildInvoiceSmsMessage(params: InvoiceSmsTemplateParams): string {
  const formattedAmount = params.amount.toLocaleString("en-TZ");
  return `Habari ${params.parentName}, ankara mpya ya ada ya shule (${params.invoiceNo}) kwa ${params.pupilName} imetolewa. Kiasi: TZS ${formattedAmount}. Tarehe ya mwisho: ${params.dueDate}. Asante - Aberdeen Daycare & Nursery School.`;
}

export function buildBroadcastSmsMessage(
  params: BroadcastSmsTemplateParams
): string {
  const greeting = params.parentName ? `Habari ${params.parentName}, ` : "Habari Mzazi/Mlezi, ";
  return `${greeting}[${params.subject}] ${params.messageBody} - Uongozi wa Aberdeen Daycare & Nursery.`;
}

export interface BeemSendRequest {
  recipients: string[]; // +255XXXXXXXXX
  message: string;
}

export interface BeemSendResult {
  success: boolean;
  simulated: boolean;
  recipientCount: number;
  gatewayResponse?: unknown;
  error?: string;
}

/**
 * Server-side utility to dispatch SMS via Beem Africa REST API
 * Endpoint: https://apisms.beem.africa/v1/send
 */
export async function sendBeemSms({
  recipients,
  message,
}: BeemSendRequest): Promise<BeemSendResult> {
  const validRecipients = recipients.filter((r) => isValidTanzaniaPhone(r));

  if (validRecipients.length === 0) {
    return {
      success: false,
      simulated: false,
      recipientCount: 0,
      error: "No valid Tanzania (+255XXXXXXXXX) phone numbers provided.",
    };
  }

  const apiKey = process.env.BEEM_API_KEY;
  const secretKey = process.env.BEEM_SECRET_KEY;
  const senderId = process.env.BEEM_SENDER_ID || "INFO";

  const beemRecipients = validRecipients.map((phone, index) => ({
    recipient_id: index + 1,
    dest_addr: normalizeToBeemRecipient(phone),
  }));

  // If Beem credentials are not yet configured in environment, return safe sandbox simulation
  if (
    !apiKey ||
    !secretKey ||
    apiKey === "your-beem-api-key" ||
    secretKey === "your-beem-secret-key"
  ) {
    return {
      success: true,
      simulated: true,
      recipientCount: validRecipients.length,
      gatewayResponse: {
        status: "SANDBOX_SIMULATED",
        source_addr: senderId,
        recipients: beemRecipients,
        message_preview: message,
        timestamp: new Date().toISOString(),
      },
    };
  }

  const basicAuth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  try {
    const response = await fetch("https://apisms.beem.africa/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        source_addr: senderId,
        encoding: 0,
        schedule_time: "",
        message,
        recipients: beemRecipients,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        simulated: false,
        recipientCount: validRecipients.length,
        gatewayResponse: data,
        error: data?.message || `Beem API returned HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      simulated: false,
      recipientCount: validRecipients.length,
      gatewayResponse: data,
    };
  } catch (err) {
    return {
      success: false,
      simulated: false,
      recipientCount: validRecipients.length,
      error: err instanceof Error ? err.message : "Network error contacting Beem Africa gateway",
    };
  }
}
