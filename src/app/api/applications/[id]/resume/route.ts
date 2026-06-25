import { errorResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import {
    buildResumeDownloadUrl,
    buildResumeViewUrl,
} from "@/lib/resume";
import { connectToDB } from "@/lib/db/mongoose";
import { Application } from "@/schemas/Application";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        const application = await Application.findById(id);

        if (!application?.resume?.publicId)
            return NextResponse.json(errorResponse("Resume not found"), {
                status: 404,
            });

        const inline = req.nextUrl.searchParams.get("view") === "1";
        const url = inline
            ? buildResumeViewUrl(application.resume.publicId)
            : buildResumeDownloadUrl(
                  application.resume.publicId,
                  application.name
              );

        return NextResponse.redirect(url);
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch resume", err as Error),
            { status: 500 }
        );
    }
}
