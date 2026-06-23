"use client";

import { fetchAPI } from "@/lib/api";
import { ExperienceLevel } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { toast } from "sonner";

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
    { value: "junior", label: "Junior (0-2 years)" },
    { value: "mid", label: "Mid-Level (2-5 years)" },
    { value: "senior", label: "Senior (5+ years)" },
    { value: "lead", label: "Lead/Architect (8+ years)" },
];

interface FormData {
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    canJoin: string;
    coverLetter: string;
}

interface ApplicationFormProps {
    jobId: string;
    jobTitle: string;
}

const fieldClass = "career-field w-full";
const labelClass = "career-label";

export default function ApplicationForm({
    jobId,
    jobTitle,
}: ApplicationFormProps) {
    const router = useRouter();
    const [currentSection, setCurrentSection] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        primarySkills: "",
        secondarySkills: "",
        github: "",
        linkedin: "",
        portfolio: "",
        canJoin: "",
        coverLetter: "",
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const uploadResume = async (): Promise<{ url: string; publicId: string }> => {
        if (!resumeFile) throw new Error("No resume");
        const fd = new FormData();
        fd.append("file", resumeFile);
        fd.append("type", "resume");

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        return json.data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error("Please upload your resume (PDF)");
            return;
        }
        setLoading(true);
        try {
            const resume = await uploadResume();
            await fetchAPI("/applications", {
                method: "POST",
                body: JSON.stringify({
                    jobId,
                    ...formData,
                    resume,
                }),
            });
            toast.success("Application submitted successfully!");
            router.push(`/jobs?applied=true`);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to submit"
            );
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        {
            title: "Personal",
            fields: (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className={labelClass}>Full Name *</label>
                        <input
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Phone *</label>
                        <input
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Location *</label>
                        <input
                            value={formData.location}
                            onChange={(e) =>
                                handleChange("location", e.target.value)
                            }
                            required
                            className={fieldClass}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Skills",
            fields: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelClass}>Experience Level *</label>
                        <select
                            value={formData.experience}
                            onChange={(e) =>
                                handleChange("experience", e.target.value)
                            }
                            required
                            className={fieldClass}
                        >
                            <option value="" className="bg-[#0f1520]">
                                Select level
                            </option>
                            {EXPERIENCE_LEVELS.map((l) => (
                                <option
                                    key={l.value}
                                    value={l.value}
                                    className="bg-[#0f1520]"
                                >
                                    {l.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Primary Skills *</label>
                        <textarea
                            value={formData.primarySkills}
                            onChange={(e) =>
                                handleChange("primarySkills", e.target.value)
                            }
                            required
                            rows={3}
                            className={`${fieldClass} min-h-[88px] resize-y`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Secondary Skills</label>
                        <textarea
                            value={formData.secondarySkills}
                            onChange={(e) =>
                                handleChange("secondarySkills", e.target.value)
                            }
                            rows={2}
                            className={`${fieldClass} min-h-[72px] resize-y`}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label
                                className={`${labelClass} flex items-center gap-2`}
                            >
                                <FaGithub className="text-[var(--career-text-subtle)]" /> GitHub
                            </label>
                            <input
                                value={formData.github}
                                onChange={(e) =>
                                    handleChange("github", e.target.value)
                                }
                                className={fieldClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                className={`${labelClass} flex items-center gap-2`}
                            >
                                <FaLinkedin className="text-[var(--career-text-subtle)]" />{" "}
                                LinkedIn
                            </label>
                            <input
                                value={formData.linkedin}
                                onChange={(e) =>
                                    handleChange("linkedin", e.target.value)
                                }
                                className={fieldClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                className={`${labelClass} flex items-center gap-2`}
                            >
                                <FaGlobe className="text-[var(--career-text-subtle)]" /> Portfolio
                            </label>
                            <input
                                value={formData.portfolio}
                                onChange={(e) =>
                                    handleChange("portfolio", e.target.value)
                                }
                                className={fieldClass}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>
                            Resume (PDF, max 5MB) *
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                                setResumeFile(e.target.files?.[0] || null)
                            }
                            className={`${fieldClass} file:mr-4 file:rounded-md file:border-0 file:bg-[var(--career-bg-muted)] file:px-3 file:py-1 file:text-sm file:font-medium file:text-[var(--career-text)]`}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Final",
            fields: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelClass}>
                            When can you join? *
                        </label>
                        <input
                            value={formData.canJoin}
                            onChange={(e) =>
                                handleChange("canJoin", e.target.value)
                            }
                            placeholder="e.g. Immediately, 2 weeks notice"
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Cover Letter *</label>
                        <textarea
                            value={formData.coverLetter}
                            onChange={(e) =>
                                handleChange("coverLetter", e.target.value)
                            }
                            rows={6}
                            required
                            className={`${fieldClass} min-h-[140px] resize-y`}
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className="career-card p-6 md:p-10"
        >
            <p className="mb-1 text-sm font-medium text-[var(--career-text-muted)]">
                Applying for
            </p>
            <h2 className="mb-8 text-2xl font-medium text-[var(--career-text)]">
                {jobTitle}
            </h2>

            <div className="mb-8 flex gap-2">
                {sections.map((s, i) => (
                    <button
                        key={s.title}
                        type="button"
                        onClick={() => setCurrentSection(i)}
                        className={`flex-1 rounded-md border py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                            currentSection === i
                                ? "border-[var(--career-text)] bg-[var(--career-text)] text-white"
                                : "border-[var(--career-border)] bg-white text-[var(--career-text-muted)] hover:bg-[var(--career-bg-subtle)]"
                        }`}
                    >
                        {i + 1}. {s.title}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    {sections[currentSection].fields}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between gap-4">
                <button
                    type="button"
                    onClick={() =>
                        setCurrentSection((p) => Math.max(0, p - 1))
                    }
                    disabled={currentSection === 0}
                    className="career-btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>
                {currentSection < sections.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => setCurrentSection((p) => p + 1)}
                        className="career-btn-primary"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={loading}
                        className="career-btn-primary disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                )}
            </div>
        </form>
    );
}
