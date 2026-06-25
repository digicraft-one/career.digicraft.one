import { errorResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import {
    buildContentDisposition,
    fetchResumeBuffer,
    sanitizeResumeFilename,
} from "@/lib/resume";
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

        if (!application?.resume?.publicId && !application?.resume?.url)
            return NextResponse.json(errorResponse("Resume not found"), {
                status: 404,
            });

        const buffer = await fetchResumeBuffer(application.resume);
        if (!buffer)
            return NextResponse.json(
                errorResponse("Resume file could not be retrieved"),
                { status: 404 }
            );

        const inline = req.nextUrl.searchParams.get("view") === "1";
        const filename = sanitizeResumeFilename(application.name);

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": buildContentDisposition(
                    filename,
                    inline
                ),
                "Content-Length": String(buffer.length),
                "Cache-Control": "private, no-cache",
            },
        });
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch resume", err as Error),
            { status: 500 }
        );
    }
}
