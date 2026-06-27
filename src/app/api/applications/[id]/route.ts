import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import {
    appendStatusChange,
    createActivity,
    notifyStatusChangeTelegram,
    sendStatusEmailIfRequested,
    updateSignIntegration,
} from "@/lib/hiring/workflow";
import { APPLICATION_STATUSES, Application } from "@/schemas/Application";
import { ApplicationStatus } from "@/types/schemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        const application = await Application.findById(id).populate(
            "jobId",
            "title seo.slug"
        );
        if (!application)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });
        return NextResponse.json(successResponse(application));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Error fetching application", err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        const deleted = await Application.findByIdAndDelete(id);
        if (!deleted)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });
        return NextResponse.json(successResponse(null, "Application deleted"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Error deleting application", err as Error),
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        const body = await req.json();
        const adminName = session.user?.name || "Admin";

        const app = await Application.findById(id);
        if (!app)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });

        const sendEmail = body.sendEmail === true;
        let statusChanged = false;

        if (body.status) {
            if (!APPLICATION_STATUSES.includes(body.status))
                return NextResponse.json(
                    errorResponse("Invalid status"),
                    { status: 400 }
                );

            if (body.status === "declined") {
                const reason =
                    body.declineReason?.trim() || app.declineReason?.trim();
                if (!reason) {
                    return NextResponse.json(
                        errorResponse("Decline reason is required"),
                        { status: 400 }
                    );
                }
                body.declineReason = reason;
            }

            if (body.status !== app.status) {
                appendStatusChange(app, body.status as ApplicationStatus, adminName, {
                    note: body.statusNote,
                    declineReason: body.declineReason,
                });
                statusChanged = true;
            }
        }

        if (body.notes) {
            if (!Array.isArray(body.notes))
                return NextResponse.json(
                    errorResponse("Invalid notes"),
                    { status: 400 }
                );

            const addedNotes = body.notes.filter(
                (n: string) => !app.notes.includes(n)
            );
            app.notes = body.notes;
            for (const note of addedNotes) {
                app.activities.push(
                    createActivity("note_added", adminName, "Note added", {
                        note,
                    })
                );
            }
        }

        if (body.signIntegration) {
            updateSignIntegration(app, body.signIntegration, adminName);
        }

        if (statusChanged && sendEmail) {
            await sendStatusEmailIfRequested(
                app,
                app.status,
                adminName,
                true,
                { contractUrl: app.signIntegration?.contractUrl }
            );
        }

        if (statusChanged) {
            await notifyStatusChangeTelegram(
                app.name,
                app.jobTitle,
                app.status
            );
        }

        await app.save();

        return NextResponse.json(
            successResponse(app, "Application updated")
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to update application", err as Error),
            { status: 500 }
        );
    }
}
