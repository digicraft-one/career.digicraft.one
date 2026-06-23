interface SectionHeadingProps {
    title: string;
    highlight?: string;
    subtitle?: string;
    align?: "left" | "center";
}

export default function SectionHeading({
    title,
    highlight,
    subtitle,
    align = "left",
}: SectionHeadingProps) {
    const alignClass = align === "center" ? "text-center mx-auto" : "";

    return (
        <div className={`mb-12 max-w-3xl ${alignClass}`}>
            <h2 className={`section-title ${alignClass}`}>
                {title}
                {highlight && (
                    <>
                        {" "}
                        <span className="font-medium">{highlight}</span>
                    </>
                )}
            </h2>
            {subtitle && (
                <p
                    className={`section-subtitle ${align === "center" ? "mx-auto" : ""}`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
