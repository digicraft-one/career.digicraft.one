import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import cloudinary from "@/lib/cloudinary";
import {
    isPdfUpload,
    resumeUploadFolder,
    resumeUploadPublicId,
} from "@/lib/resume";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const type = formData.get("type") as string | null;

        if (!file || !(file instanceof Blob))
            return NextResponse.json(errorResponse("No file uploaded"), {
                status: 400,
            });

        if (file.size > MAX_FILE_SIZE)
            return NextResponse.json(errorResponse("File too large (max 5MB)"), {
                status: 400,
            });

        const isResume = type === "resume";
        const fileName = file instanceof File ? file.name : undefined;

        if (isResume) {
            if (!isPdfUpload(file, fileName))
                return NextResponse.json(
                    errorResponse("Resume must be a PDF file"),
                    { status: 400 }
                );
        } else {
            const session = await getServerSession(authOptions);
            if (!session)
                return NextResponse.json(errorResponse("Unauthorized"), {
                    status: 401,
                });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const folder = isResume ? resumeUploadFolder() : "digicraft-careers";

        return new Promise((resolve) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: isResume ? "raw" : "auto",
                    ...(isResume
                        ? { public_id: resumeUploadPublicId() }
                        : {}),
                },
                (
                    error: UploadApiErrorResponse | undefined,
                    result: UploadApiResponse | undefined
                ) => {
                    if (error || !result) {
                        resolve(
                            NextResponse.json(
                                errorResponse("Upload failed", error ?? null),
                                { status: 500 }
                            )
                        );
                    } else {
                        resolve(
                            NextResponse.json(
                                successResponse(
                                    {
                                        url: result.secure_url,
                                        publicId: result.public_id,
                                    },
                                    "File uploaded"
                                )
                            )
                        );
                    }
                }
            );
            bufferToStream(buffer).pipe(stream);
        });
    } catch (err) {
        return NextResponse.json(
            errorResponse("Unexpected error during upload", err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        const body = await req.json();
        const { publicId, resourceType = "image" } = body;

        if (!publicId)
            return NextResponse.json(
                errorResponse("Missing publicId"),
                { status: 400 }
            );

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        if (result.result !== "ok")
            return NextResponse.json(
                errorResponse("Failed to delete file"),
                { status: 500 }
            );

        return NextResponse.json(successResponse(null, "File deleted"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Unexpected error during deletion", err as Error),
            { status: 500 }
        );
    }
}
