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
    sendInvoiceAlertAndSms,
    sendBroadcastSms,
  } = usePortal();

  const canAccess = ["admin", "owner", "secretary"].includes(currentUser.role);

  // Invoice generation form state
  const [selectedPupilId, setSelectedPupilId] = useState(
    pupils[0]?.id || "pup-1"
  );
  const [amount, setAmount] = useState("650000");
  const [dueDate, setDueDate] = useState("2026-11-30");
  const [autoSendSms, setAutoSendSms] = useState(true);
  const [creatingInv, setCreatingInv] = useState(false);

  // Payment recording state
  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>(
    {}
  );

  // Broadcast SMS state
  const [broadcastTarget, setBroadcastTarget] = useState<
    "all_parents" | "step_1" | "step_2" | "step_3"
  >("all_parents");
  const [broadcastSubject, setBroadcastSubject] = useState(
    "Taarifa ya Shule / School Notice"
  );
  const [broadcastBody, setBroadcastBody] = useState(
    "Kikao cha wazazi na walimu kitafanyika Ijumaa tarehe 13 Novemba saa 3:00 asubuhi shuleni Aberdeen."
  );
  const [sendingSms, setSendingSms] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

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

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;

    setCreatingInv(true);
    try {
      const res = await createInvoice({
        pupilId: selectedPupilId,
        amount: numericAmount,
        dueDate,
        sendSms: autoSendSms,
      });
      if (res.ok) {
        setStatusBanner(
          `Invoice ${res.invoiceNo} generated${
            autoSendSms
              ? " & dispatched to parent via in-app alert + Beem Africa SMS!"
              : "!"
          }`
        );
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
    setStatusBanner(
      `Recorded payment of TZS ${val.toLocaleString()} and notified parent.`
    );
  };

  const handleDispatchInvoiceSms = async (invoiceId: string) => {
    setSendingSms(true);
    try {
      const res = await sendInvoiceAlertAndSms(invoiceId);
      if (res.ok) {
        setStatusBanner(`Beem SMS Dispatched: "${res.messageDispatched}"`);
      }
    } finally {
      setSendingSms(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredPupils =
      broadcastTarget === "all_parents"
        ? pupils
        : pupils.filter((p) => p.class_key === broadcastTarget);

    const recipients = Array.from(
      new Set(filteredPupils.map((p) => p.parent_phone))
    );

    setSendingSms(true);
    try {
      const res = await sendBroadcastSms({
        recipients,
        subject: broadcastSubject,
        messageBody: broadcastBody,
      });
      if (res.ok) {
        setStatusBanner(
          `Broadcast SMS sent via Beem Africa to ${recipients.length} parent(s) (+255).`
        );
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
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total Term Fees Billed
          </p>
          <p className="font-display text-2xl font-bold text-stone-900 mt-1">
            TZS {totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Total Collected
          </p>
          <p className="font-display text-2xl font-bold text-emerald-800 mt-1">
            TZS {totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Outstanding Balance
          </p>
          <p className="font-display text-2xl font-bold text-amber-800 mt-1">
            TZS {totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {statusBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-semibold flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusBanner}</span>
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
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
                Fee Billing &amp; Invoicing
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Generate Pupil Fee Invoice
              </h2>
            </div>
            <FileText className="w-5 h-5 text-aberdeen-700" />
          </div>

          <form onSubmit={handleGenerateInvoice} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Enrolled Pupil *
              </label>
              <select
                value={selectedPupilId}
                onChange={(e) => setSelectedPupilId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
              >
                {pupils.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pupil_name} — Parent: {p.parent_name} ({p.parent_phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Invoice Amount (TZS) *
                </label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSendSms}
                onChange={(e) => setAutoSendSms(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-aberdeen-700 focus:ring-aberdeen-600"
              />
              <span className="text-xs text-stone-700 leading-relaxed">
                <strong>Auto-dispatch Beem Africa SMS (+255) &amp; In-App Alert:</strong>{" "}
                &ldquo;Habari [Parent Name], ankara mpya ya ada ya shule kwa
                [Pupil Name] imetolewa. Kiasi: TZS {Number(amount || 0).toLocaleString()}...&rdquo;
              </span>
            </label>

            <button
              type="submit"
              disabled={creatingInv}
              className="w-full py-3 rounded-xl bg-aberdeen-800 hover:bg-aberdeen-900 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>
                {creatingInv
                  ? "Generating & Sending..."
                  : "Generate Invoice & Notify Parent"}
              </span>
            </button>
          </form>
        </div>

        {/* Right: Beem Africa SMS Broadcast Composer */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Beem Africa SMS Gateway (+255)
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Official School Broadcast / Alert
              </h2>
            </div>
            <PhoneCall className="w-5 h-5 text-amber-600" />
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient Group (+255 Parents)
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
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                >
                  <option value="all_parents">
                    All Enrolled Parents ({pupils.length} Pupils)
                  </option>
                  <option value="step_1">Step 1 (Daycare) Parents Only</option>
                  <option value="step_2">Step 2 (Nursery) Parents Only</option>
                  <option value="step_3">Step 3 (Pre-Unit) Parents Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SMS Subject Header
                </label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                SMS Message Content (Swahili / English) *
              </label>
              <textarea
                rows={3}
                required
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
              />
            </div>

            <button
              type="submit"
              disabled={sendingSms}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>
                {sendingSms
                  ? "Dispatching via /api/sms/send..."
                  : "Send Official Beem Africa SMS"}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Invoices Table & Payment Status Updater */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
              Fee Payment Records
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Invoices, Balances &amp; One-Click Beem SMS Reminders
            </h3>
          </div>
          <CreditCard className="w-6 h-6 text-aberdeen-700" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Pupil &amp; Parent (+255)</th>
                <th className="py-3 px-3">Billed / Paid</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Record Payment (TZS)</th>
                <th className="py-3 px-3 text-right">SMS Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {invoices.map((inv) => {
                const balance = Math.max(0, inv.amount - inv.amount_paid);
                const statusBadge =
                  inv.status === "paid"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : inv.status === "partial"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-red-100 text-red-800 border-red-200";

                return (
                  <tr key={inv.id} className="hover:bg-[#faf8f4]">
                    <td className="py-4 px-3 font-mono text-xs font-bold text-stone-900">
                      {inv.invoice_no}
                      <span className="block text-[11px] font-sans font-normal text-stone-500">
                        Due: {inv.due_date}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-bold text-stone-900">
                        {inv.pupil_name}
                      </p>
                      <p className="text-xs text-stone-600">
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
                      <p className="font-bold text-stone-900">
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
                            className="w-28 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRecordPayment(inv.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold">
                          Cleared in Full
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button
                        type="button"
                        disabled={sendingSms}
                        onClick={() => handleDispatchInvoiceSms(inv.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                      >
                        <MessageSquareShare className="w-3.5 h-3.5" />
                        <span>Send SMS + Alert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beem Africa Gateway Dispatch Log */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              /api/sms/send Gateway Audit Trail
            </span>
            <h3 className="font-display text-lg font-bold text-white">
              Recent Beem Africa SMS Dispatches ({smsLogs.length})
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
            POST https://apisms.beem.africa/v1/send
          </span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {smsLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-stone-800/90 border border-stone-700 text-xs space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-stone-400">
                <span>
                  By <strong className="text-white">{log.senderName}</strong> (
                  {log.senderRole.toUpperCase()}) • To:{" "}
                  <code className="text-amber-300">
                    {log.recipients.join(", ")}
                  </code>
                </span>
                <span>{new Date(log.sentAt).toLocaleString()}</span>
              </div>
              <p className="text-stone-200 font-mono">{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
