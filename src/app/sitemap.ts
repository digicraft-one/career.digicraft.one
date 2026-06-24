import { connectToDB } from "@/lib/db/mongoose";
import { Job } from "@/schemas/Job";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://career.digicraft.one";

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/culture`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];

    try {
        await connectToDB();
        const jobs = await Job.find({ status: "published" }).select("seo.slug updatedAt").lean();
        const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
            url: `${baseUrl}/jobs/${job.seo.slug}`,
            lastModified: job.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
        return [...staticPages, ...jobPages];
    } catch {
        return staticPages;
    }
}
