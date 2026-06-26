import AdminPageHeader from "@/components/admin/AdminPageHeader";
import JobForm from "../../_components/JobForm";
import { Card, CardContent } from "@/components/ui/card";
import { connectToDB } from "@/lib/db/mongoose";
import { Job } from "@/schemas/Job";
import { Job as JobType } from "@/lib/types";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
    const { id } = await params;
    await connectToDB();
    const job = await Job.findById(id).lean();
    if (!job) notFound();

    const jobData: JobType = {
        _id: String(job._id),
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        niceToHave: job.niceToHave,
        salaryRange: job.salaryRange,
        status: job.status,
        seo: job.seo,
        publishedAt: job.publishedAt?.toISOString(),
        applicationDeadline: job.applicationDeadline?.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
    };

    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Edit job"
                description={job.title}
            />
            <Card className="bg-white">
                <CardContent className="p-5 sm:p-6">
                    <JobForm initialData={jobData} />
                </CardContent>
            </Card>
        </div>
    );
}
