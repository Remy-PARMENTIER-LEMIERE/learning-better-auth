import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function ReturnButton({
	href,
	label,
}: {
	href: string;
	label: string;
}) {
	return (
		<Button>
			<ArrowLeft className="size-5" />
			<Link href={href}>{label}</Link>
		</Button>
	);
}
