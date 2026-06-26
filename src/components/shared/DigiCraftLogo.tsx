import { DIGICRAFT_LOGO_PATH } from "@/lib/branding";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DigiCraftLogoProps {
    size?: number;
    className?: string;
    priority?: boolean;
}

export default function DigiCraftLogo({
    size = 40,
    className,
    priority = false,
}: DigiCraftLogoProps) {
    return (
        <Image
            src={DIGICRAFT_LOGO_PATH}
            alt="DigiCraft"
            width={size}
            height={size}
            className={cn("rounded-full object-contain shrink-0", className)}
            priority={priority}
        />
    );
}
