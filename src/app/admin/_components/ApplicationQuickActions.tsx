"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DEFAULT_TIMEZONE } from "@/lib/hiring/constants";
import { buildSignHiringUserUrl } from "@/lib/signIntegration";
import { Application } from "@/lib/types";
import { EmailTemplateId, InterviewMode } from "@/types/schemas";
import { formatISTShort } from "@/lib/timezone";
import { ChevronDown, ExternalLink, PenLine } from "lucide-react";
import { useState } from "react";

interface ApplicationQuickActionsProps {
    app: Application;
    loading: boolean;
    onScheduleInterview: (data: {
        round: number;
        scheduledAt: string;
        timezone: string;
        mode: InterviewMode;
        meetingLink: string;
        interviewer: string;
        notes: string;
        sendInvite: boolean;
    }) => Promise<void>;
    onSendInterviewInvite: (interviewId: string) => Promise<void>;
    onSaveContract: (data: {
        contractUrl: string;
        moveToOffer: boolean;
    }) => Promise<void>;
    onSendEmail: (data: {
        templateId: EmailTemplateId;
        customBody?: string;
    }) => Promise<void>;
}

export default function ApplicationQuickActions({
    app,
    loading,
    onScheduleInterview,
    onSendInterviewInvite,
    onSaveContract,
    onSendEmail,
}: ApplicationQuickActionsProps) {
    const [interviewOpen, setInterviewOpen] = useState(
        ["shortlisted", "interview", "under_review"].includes(app.status)
    );
    const [offerOpen, setOfferOpen] = useState(
        ["selected", "offer"].includes(app.status)
    );
    const [customEmailOpen, setCustomEmailOpen] = useState(false);

    const [scheduledAt, setScheduledAt] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [contractUrl, setContractUrl] = useState(
        app.signIntegration?.contractUrl || ""
    );
    const [customMessage, setCustomMessage] = useState("");

    const nextRound =
        app.interviews?.length > 0
            ? Math.max(...app.interviews.map((i) => i.round)) + 1
            : 1;

    const signPrefillUrl = buildSignHiringUserUrl(app);

    return (
        <div className="space-y-3">
            <CollapsibleSection
                title="Interview"
                open={interviewOpen}
                onToggle={() => setInterviewOpen((v) => !v)}
            >
                <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs text-slate-500">
                                Date & time (IST)
                            </Label>
                            <Input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) =>
                                    setScheduledAt(e.target.value)
                                }
                                disabled={loading}
                                className="mt-1 bg-white"
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-slate-500">
                                Meet / Zoom link
                            </Label>
                            <Input
                                value={meetingLink}
                                onChange={(e) =>
                                    setMeetingLink(e.target.value)
                                }
                                placeholder="https://meet.google.com/..."
                                disabled={loading}
                                className="mt-1 bg-white"
                            />
                        </div>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        disabled={
                            loading || !scheduledAt || !meetingLink.trim()
                        }
                        onClick={() =>
                            onScheduleInterview({
                                round: nextRound,
                                scheduledAt,
                                timezone: DEFAULT_TIMEZONE,
                                mode: "google_meet",
                                meetingLink: meetingLink.trim(),
                                interviewer: "",
                                notes: "",
                                sendInvite: true,
                            })
                        }
                    >
                        {loading ? (
                            <LoadingSpinner label="Scheduling…" />
                        ) : (
                            "Schedule & email invite"
                        )}
                    </Button>

                    {app.interviews?.length > 0 && (
                        <ul className="space-y-2 pt-1">
                            {app.interviews.map((iv) => (
                                <li
                                    key={iv.id}
                                    className="text-xs rounded-md bg-slate-50 border border-slate-100 px-3 py-2 space-y-1"
                                >
                                    <p className="font-medium text-slate-800">
                                        Round {iv.round} ·{" "}
                                        {formatISTShort(iv.scheduledAt)}
                                    </p>
                                    {iv.meetingLink && (
                                        <a
                                            href={iv.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:underline break-all inline-flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Join link
                                        </a>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[11px]"
                                        disabled={loading}
                                        onClick={() =>
                                            onSendInterviewInvite(iv.id)
                                        }
                                    >
                                        Resend invite
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection
                title="Offer & contract"
                open={offerOpen}
                onToggle={() => setOfferOpen((v) => !v)}
            >
                <div className="space-y-3 pt-1">
                    <p className="text-[11px] text-slate-500">
                        Create the contract in Sign, copy the signing link from
                        the contract page, then paste it below.
                    </p>
                    <a
                        href={signPrefillUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-white"
                        >
                            <PenLine className="w-3.5 h-3.5 mr-1.5" />
                            Open Sign (prefilled)
                        </Button>
                    </a>
                    <div>
                        <Label className="text-xs text-slate-500">
                            Contract link
                        </Label>
                        <Input
                            value={contractUrl}
                            onChange={(e) => setContractUrl(e.target.value)}
                            placeholder="Paste signing URL from Sign admin"
                            disabled={loading}
                            className="mt-1 bg-white"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        disabled={loading || !contractUrl.trim()}
                        onClick={() =>
                            onSaveContract({
                                contractUrl: contractUrl.trim(),
                                moveToOffer: true,
                            })
                        }
                    >
                        {loading ? (
                            <LoadingSpinner label="Saving…" />
                        ) : (
                            "Save contract link"
                        )}
                    </Button>
                </div>
            </CollapsibleSection>

            <CollapsibleSection
                title="Custom email"
                open={customEmailOpen}
                onToggle={() => setCustomEmailOpen((v) => !v)}
            >
                <div className="space-y-3 pt-1">
                    <Textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={3}
                        disabled={loading}
                        placeholder="Write a short message to the candidate…"
                        className="bg-white text-sm"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="bg-white"
                        disabled={loading || !customMessage.trim()}
                        onClick={() =>
                            onSendEmail({
                                templateId: "custom",
                                customBody: customMessage.trim(),
                            })
                        }
                    >
                        {loading ? (
                            <LoadingSpinner label="Sending…" />
                        ) : (
                            "Send email"
                        )}
                    </Button>
                </div>
            </CollapsibleSection>
        </div>
    );
}

function CollapsibleSection({
    title,
    open,
    onToggle,
    children,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="px-3 pb-3 border-t border-slate-100">{children}</div>
            )}
        </div>
    );
}
