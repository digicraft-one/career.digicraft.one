import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import {
    sendApplicationConfirmationEmail,
    sendExternalNotification,
    sendNewApplicationAdminEmail,
} from "@/lib/email/brevo";
import { buildResumeDownloadUrl } from "@/lib/resume";
import { sendApplicationNotification } from "@/lib/telegram/telegram";
import { Application } from "@/schemas/Application";
import { Job } from "@/schemas/Job";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");
        const status = searchParams.get("status");

        const filter: Record<string, unknown> = {};
        if (jobId) filter.jobId = jobId;
        if (status) filter.status = status;

        const applications = await Application.find(filter).sort({
            createdAt: -1,
        });
        return NextResponse.json(successResponse(applications));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch applications", err as Error),
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const requiredFields = [
            "jobId",
            "name",
            "email",
            "phone",
            "location",
            "experience",
            "primarySkills",
            "resume",
            "canJoin",
            "coverLetter",
        ];
        for (const field of requiredFields) {
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );
        }

        const job = await Job.findById(body.jobId);
        if (!job || job.status !== "published")
            return NextResponse.json(
                errorResponse("Job not found or not accepting applications"),
                { status: 400 }
            );

        if (
            job.applicationDeadline &&
            new Date(job.applicationDeadline) < new Date()
        )
            return NextResponse.json(
                errorResponse("Application deadline has passed"),
                { status: 400 }
            );

        const created = await Application.create({
            jobId: body.jobId,
            jobTitle: job.title,
            name: body.name,
            email: body.email,
            phone: body.phone,
            location: body.location,
            experience: body.experience,
            primarySkills: body.primarySkills,
            secondarySkills: body.secondarySkills ?? "",
            github: body.github ?? "",
            linkedin: body.linkedin ?? "",
            portfolio: body.portfolio ?? "",
            resume: body.resume,
            canJoin: body.canJoin,
            coverLetter: body.coverLetter,
            statusHistory: [
                { status: "pending", changedAt: new Date(), changedBy: "System" },
            ],
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://career.digicraft.one";
        const adminLink = `${baseUrl}/admin/applications`;

        try {
            await sendApplicationNotification({
                name: body.name,
                email: body.email,
                phone: body.phone,
                jobTitle: job.title,
                primarySkills: body.primarySkills,
                resume: buildResumeDownloadUrl(
                    body.resume.publicId,
                    body.name
                ),
            });
        } catch (e) {
            console.error("Telegram notification failed:", e);
        }

        try {
            const emailResult = await sendApplicationConfirmationEmail({
                name: body.name,
                email: body.email,
                jobTitle: job.title,
            });
            if (!emailResult.success) {
                console.error(
                    "Confirmation email failed:",
                    emailResult.error
                );
            }
        } catch (e) {
            console.error("Confirmation email failed:", e);
        }

        try {
            const adminEmailResult = await sendNewApplicationAdminEmail({
                name: body.name,
                email: body.email,
                phone: body.phone,
                jobTitle: job.title,
                primarySkills: body.primarySkills,
                resumeUrl: buildResumeDownloadUrl(
                    body.resume.publicId,
                    body.name
                ),
                adminLink,
            });
            if (!adminEmailResult.success) {
                console.error(
                    "Admin notification email failed:",
                    adminEmailResult.error
                );
            }
        } catch (e) {
            console.error("Admin notification email failed:", e);
        }

        try {
            await sendExternalNotification({
                title: "New Career Application",
                body: `${body.name} applied for ${job.title}`,
                applicantName: body.name,
                applicantEmail: body.email,
                jobTitle: job.title,
                link: adminLink,
            });
        } catch (e) {
            console.error("External notification failed:", e);
        }

        return NextResponse.json(
            successResponse(created, "Application submitted"),
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to submit application", err as Error),
            { status: 500 }
        );
    }
}
