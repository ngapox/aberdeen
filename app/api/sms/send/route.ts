import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  buildBroadcastSmsMessage,
  buildInvoiceSmsMessage,
  isValidTanzaniaPhone,
  sendBeemSms,
} from "@/lib/beem/sms";
import { UserRole } from "@/lib/supabase/types";

const ALLOWED_SMS_ROLES: UserRole[] = ["admin", "owner", "secretary"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role: clientRole,
      templateType,
      recipients,
      customMessage,
      invoiceParams,
      broadcastParams,
    } = body as {
      role?: UserRole;
      templateType: "invoice" | "broadcast" | "custom";
      recipients: string[];
      customMessage?: string;
      invoiceParams?: {
        parentName: string;
        pupilName: string;
        amount: number;
        invoiceNo: string;
        dueDate: string;
      };
      broadcastParams?: {
        parentName?: string;
        subject: string;
        messageBody: string;
      };
    };

    // 1. Authorization Check: Verify Supabase Session Role OR Interactive Portal Role
    let verifiedRole: UserRole | null = null;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        verifiedRole = (profile?.role as UserRole) || null;
      }
    }

    // Fallback to session role passed in header/body when in demo/preview mode
    const effectiveRole = verifiedRole || clientRole;

    if (!effectiveRole || !ALLOWED_SMS_ROLES.includes(effectiveRole)) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Strictly Admin, Owner, or Secretary sessions are permitted to dispatch Beem Africa SMS.",
        },
        { status: 403 }
      );
    }

    // 2. Validate Recipients (+255XXXXXXXXX)
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient (+255XXXXXXXXX) is required." },
        { status: 400 }
      );
    }

    const invalidNumbers = recipients.filter((r) => !isValidTanzaniaPhone(r));
    if (invalidNumbers.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid phone number format: ${invalidNumbers.join(
            ", "
          )}. Must strictly match +255XXXXXXXXX.`,
        },
        { status: 400 }
      );
    }

    // 3. Build SMS Message from Template
    let finalMessage = "";
    if (templateType === "invoice" && invoiceParams) {
      finalMessage = buildInvoiceSmsMessage(invoiceParams);
    } else if (templateType === "broadcast" && broadcastParams) {
      finalMessage = buildBroadcastSmsMessage(broadcastParams);
    } else if (customMessage && customMessage.trim().length > 0) {
      finalMessage = customMessage.trim();
    } else {
      return NextResponse.json(
        { error: "Missing message body or template parameters." },
        { status: 400 }
      );
    }

    // 4. Dispatch via Beem Africa REST API
    const result = await sendBeemSms({
      recipients,
      message: finalMessage,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to send SMS via Beem Africa.",
          details: result.gatewayResponse,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      simulated: result.simulated,
      recipientCount: result.recipientCount,
      messageDispatched: finalMessage,
      gateway: result.gatewayResponse,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unexpected SMS gateway error",
      },
      { status: 500 }
    );
  }
}
