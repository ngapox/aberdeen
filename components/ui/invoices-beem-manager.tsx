"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  FileText,
  MessageSquareShare,
  PhoneCall,
  Plus,
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { usePortal } from "./portal-context";
import { STEP_META } from "@/lib/supabase/seed-data";

export function InvoicesAndBeemManager() {
  const {
    currentUser,
    pupils,
    invoices,
    smsLogs,
    createInvoice,
    recordInvoicePayment,
    deleteInvoice,
    sendInvoiceAlertAndSms,
    sendBroadcastSms,
  } = usePortal();

  const canAccess = ["admin", "owner", "secretary"].includes(currentUser.role);

  const [selectedPupilId, setSelectedPupilId] = useState(
    pupils[0]?.id || ""
  );
  const [amount, setAmount] = useState("650000");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [autoSendSms, setAutoSendSms] = useState(true);
  const [creatingInv, setCreatingInv] = useState(false);

  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>(
    {}
  );

  // Broadcast or Direct SMS state
  const [broadcastTarget, setBroadcastTarget] = useState<
    "all_parents" | "step_1" | "step_2" | "step_3" | "custom_phone"
  >("all_parents");
  const [customPhone, setCustomPhone] = useState("+255");
  const [broadcastSubject, setBroadcastSubject] = useState(
    "Taarifa ya Shule / Aberdeen Notice"
  );
  const [broadcastBody, setBroadcastBody] = useState("");
  const [sendingSms, setSendingSms] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  if (!canAccess) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-2">
        <ShieldAlert className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-bold text-red-900 text-lg">
          Restricted Access (RBAC Policy)
        </h3>
        <p className="text-xs text-red-700 max-w-md mx-auto">
          Fee Invoice Generation and Beem Africa SMS Gateway are strictly
          restricted to Admin, Owner, and Secretary sessions.
        </p>
      </div>
    );
  }

  const effectivePupilId =
    pupils.find((p) => p.id === selectedPupilId)?.id || pupils[0]?.id || "";

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectivePupilId) {
      setStatusBanner({
        type: "err",
        text: "Please register a pupil first in the 'Accounts & Pupils (+255)' tab before generating an invoice.",
      });
      return;
    }
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;

    setCreatingInv(true);
    try {
      const res = await createInvoice({
        pupilId: effectivePupilId,
        amount: numericAmount,
        dueDate,
        sendSms: autoSendSms,
      });
      if (res.ok) {
        setStatusBanner({
          type: "ok",
          text: `Invoice ${res.invoiceNo} generated${
            autoSendSms
              ? " & dispatched to parent via in-app alert + Beem Africa SMS!"
              : "!"
          }`,
        });
      } else {
        setStatusBanner({
          type: "err",
          text: res.error || "Could not create invoice.",
        });
      }
    } finally {
      setCreatingInv(false);
    }
  };

  const handleRecordPayment = (invoiceId: string) => {
    const val = Number(paymentInputs[invoiceId]);
    if (!val || val <= 0) return;
    recordInvoicePayment(invoiceId, val);
    setPaymentInputs((prev) => ({ ...prev, [invoiceId]: "" }));
    setStatusBanner({
      type: "ok",
      text: `Recorded payment of TZS ${val.toLocaleString()} and notified parent.`,
    });
  };

  const handleDispatchInvoiceSms = async (invoiceId: string) => {
    setSendingSms(true);
    try {
      const res = await sendInvoiceAlertAndSms(invoiceId);
      if (res.ok) {
        setStatusBanner({
          type: "ok",
          text: `Beem SMS Dispatched: "${res.messageDispatched}"`,
        });
      } else {
        setStatusBanner({
          type: "err",
          text: res.error || "Failed to send SMS.",
        });
      }
    } finally {
      setSendingSms(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    let recipients: string[] = [];

    if (broadcastTarget === "custom_phone") {
      recipients = [customPhone.trim()];
    } else {
      const filteredPupils =
        broadcastTarget === "all_parents"
          ? pupils
          : pupils.filter((p) => p.class_key === broadcastTarget);
      recipients = Array.from(
        new Set(filteredPupils.map((p) => p.parent_phone))
      );
    }

    if (recipients.length === 0) {
      setStatusBanner({
        type: "err",
        text: "No parent phone numbers found for the selected group. Register pupils first or choose 'Single +255 Number'.",
      });
      return;
    }

    setSendingSms(true);
    try {
      const res = await sendBroadcastSms({
        recipients,
        subject: broadcastSubject,
        messageBody: broadcastBody,
      });
      if (res.ok) {
        setStatusBanner({
          type: "ok",
          text: `SMS dispatched via Beem Africa to ${recipients.length} recipient(s) (+255).`,
        });
        setBroadcastBody("");
      } else {
        setStatusBanner({
          type: "err",
          text: res.error || "Failed to send Beem SMS.",
        });
      }
    } finally {
      setSendingSms(false);
    }
  };

  const totalBilled = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amount_paid, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-8">
      {/* Financial KPI Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
            Total Term Fees Billed
          </p>
          <p className="font-display text-2xl font-bold text-[#1e3f52] mt-1">
            TZS {totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Total Collected
          </p>
          <p className="font-display text-2xl font-bold text-emerald-800 mt-1">
            TZS {totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#e59500]">
            Outstanding Balance
          </p>
          <p className="font-display text-2xl font-bold text-[#c97d00] mt-1">
            TZS {totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {statusBanner && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-4 ${
            statusBanner.type === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Create Fee Invoice */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2eef5] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                Fee Billing &amp; Invoicing
              </span>
              <h2 className="font-display text-xl font-bold text-[#1e3f52]">
                Generate Pupil Fee Invoice
              </h2>
            </div>
            <FileText className="w-5 h-5 text-[#e59500]" />
          </div>

          <form onSubmit={handleGenerateInvoice} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Select Enrolled Pupil *
              </label>
              {pupils.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-[#f2f7fa] border border-dashed border-[#9bc6de] text-xs text-[#275169]">
                  No pupils enrolled yet. Register your first pupil in the{" "}
                  <strong>Accounts &amp; Pupils (+255)</strong> tab.
                </div>
              ) : (
                <select
                  value={effectivePupilId}
                  onChange={(e) => setSelectedPupilId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm bg-white focus:outline-none focus:border-[#3b7a9e]"
                >
                  {pupils.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.pupil_name} — Parent: {p.parent_name} ({p.parent_phone})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Invoice Amount (TZS) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde58a] cursor-pointer">
              <input
                type="checkbox"
                checked={autoSendSms}
                onChange={(e) => setAutoSendSms(e.target.checked)}
                className="mt-0.5 rounded border-[#e59500] text-[#3b7a9e] focus:ring-[#3b7a9e]"
              />
              <span className="text-xs text-[#1e3f52] leading-relaxed">
                <strong>Auto-dispatch Beem Africa SMS (+255) &amp; In-App Alert:</strong>{" "}
                &ldquo;Habari [Parent Name], ankara mpya ya ada ya shule kwa
                [Pupil Name] imetolewa. Kiasi: TZS{" "}
                {Number(amount || 0).toLocaleString()}...&rdquo;
              </span>
            </label>

            <button
              type="submit"
              disabled={creatingInv || pupils.length === 0}
              className="w-full py-3.5 rounded-2xl bg-[#1e3f52] hover:bg-[#132936] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-[#fbd24d]" />
              <span>
                {creatingInv
                  ? "Generating & Sending..."
                  : "Generate Invoice & Notify Parent"}
              </span>
            </button>
          </form>
        </div>

        {/* Right: Beem Africa SMS Broadcast & Individual Composer */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2eef5] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e59500]">
                Beem Africa SMS Gateway (+255)
              </span>
              <h2 className="font-display text-xl font-bold text-[#1e3f52]">
                Send Individual or Broadcast SMS
              </h2>
            </div>
            <PhoneCall className="w-5 h-5 text-[#e59500]" />
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Recipient Target
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) =>
                    setBroadcastTarget(
                      e.target.value as
                        | "all_parents"
                        | "step_1"
                        | "step_2"
                        | "step_3"
                        | "custom_phone"
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm bg-white focus:outline-none focus:border-[#3b7a9e]"
                >
                  <option value="all_parents">
                    All Enrolled Parents ({pupils.length})
                  </option>
                  <option value="step_1">Step 1 (Daycare) Parents</option>
                  <option value="step_2">Step 2 (Nursery) Parents</option>
                  <option value="step_3">Step 3 (Pre-Unit) Parents</option>
                  <option value="custom_phone">
                    Single Custom +255 Phone Number
                  </option>
                </select>
              </div>

              {broadcastTarget === "custom_phone" ? (
                <div>
                  <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                    Recipient Phone (+255XXXXXXXXX) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+255716004601"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] font-mono text-sm focus:outline-none focus:border-[#3b7a9e]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                    SMS Subject Header
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                SMS Message Content (Swahili / English) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write your official school SMS announcement here..."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
              />
            </div>

            <button
              type="submit"
              disabled={sendingSms}
              className="w-full py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>
                {sendingSms
                  ? "Dispatching via Beem Africa..."
                  : "Send Official Beem Africa SMS"}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Invoices Table & Payment Status Updater */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Fee Payment Records
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              Invoices, Balances &amp; One-Click Beem SMS Reminders (
              {invoices.length})
            </h3>
          </div>
          <CreditCard className="w-6 h-6 text-[#e59500]" />
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#f2f7fa] border-2 border-dashed border-[#9bc6de] text-center space-y-1">
            <p className="font-bold text-sm text-[#1e3f52]">
              No fee invoices generated yet.
            </p>
            <p className="text-xs text-[#2f6280]">
              When you generate an invoice on the left, it will appear here for
              payment tracking and SMS reminders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-[#e2eef5] text-xs uppercase tracking-wider text-[#3b7a9e]">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Pupil &amp; Parent (+255)</th>
                  <th className="py-3 px-3">Billed / Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Record Payment (TZS)</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2eef5]">
                {invoices.map((inv) => {
                  const balance = Math.max(0, inv.amount - inv.amount_paid);
                  const statusBadge =
                    inv.status === "paid"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : inv.status === "partial"
                      ? "bg-[#fffbeb] text-[#a36102] border-[#fde58a]"
                      : "bg-red-100 text-red-800 border-red-200";

                  return (
                    <tr key={inv.id} className="hover:bg-[#f2f7fa]">
                      <td className="py-4 px-3 font-mono text-xs font-bold text-[#1e3f52]">
                        {inv.invoice_no}
                        <span className="block text-[11px] font-sans font-normal text-[#548eb0]">
                          Due: {inv.due_date}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <p className="font-bold text-[#1e3f52]">
                          {inv.pupil_name}
                        </p>
                        <p className="text-xs text-[#275169]">
                          {inv.parent_name} •{" "}
                          <span className="font-mono">{inv.parent_phone}</span>
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            STEP_META[inv.class_key].badgeColor
                          }`}
                        >
                          {STEP_META[inv.class_key].shortLabel}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-xs">
                        <p className="font-bold text-[#1e3f52]">
                          Billed: TZS {inv.amount.toLocaleString()}
                        </p>
                        <p className="text-emerald-700 font-semibold">
                          Paid: TZS {inv.amount_paid.toLocaleString()}
                        </p>
                        {balance > 0 && (
                          <p className="text-red-700 font-semibold">
                            Bal: TZS {balance.toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusBadge}`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {inv.status !== "paid" ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              placeholder="Amount TZS"
                              value={paymentInputs[inv.id] || ""}
                              onChange={(e) =>
                                setPaymentInputs((prev) => ({
                                  ...prev,
                                  [inv.id]: e.target.value,
                                }))
                              }
                              className="w-28 px-2.5 py-1.5 rounded-lg border border-[#c6dfed] text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRecordPayment(inv.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#3b7a9e] hover:bg-[#1e3f52] text-white text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold">
                            Cleared in Full
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={sendingSms}
                            onClick={() => handleDispatchInvoiceSms(inv.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffbeb] hover:bg-[#fde58a] border border-[#fde58a] text-[#a36102] text-xs font-bold transition-colors"
                          >
                            <MessageSquareShare className="w-3.5 h-3.5" />
                            <span>Send SMS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteInvoice(inv.id)}
                            title="Delete Invoice"
                            className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Beem Africa Gateway Dispatch Log */}
      <div className="bg-[#132936] text-white rounded-3xl p-6 sm:p-8 space-y-4 border-2 border-[#275169]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbd24d]">
              /api/sms/send Gateway Audit Trail
            </span>
            <h3 className="font-display text-lg font-bold text-white">
              Beem Africa SMS Dispatches ({smsLogs.length})
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#3b7a9e]/40 text-[#9bc6de] text-xs font-mono">
            POST https://apisms.beem.africa/v1/send
          </span>
        </div>

        {smsLogs.length === 0 ? (
          <p className="text-xs text-[#9bc6de] py-4">
            No SMS messages dispatched in this session yet.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {smsLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#1e3f52] border border-[#3b7a9e] text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[#9bc6de]">
                  <span>
                    By <strong className="text-white">{log.senderName}</strong> (
                    {log.senderRole.toUpperCase()}) • To:{" "}
                    <code className="text-[#fbd24d]">
                      {log.recipients.join(", ")}
                    </code>
                  </span>
                  <span>{new Date(log.sentAt).toLocaleString()}</span>
                </div>
                <p className="text-white font-mono">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
