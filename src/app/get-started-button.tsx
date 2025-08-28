"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function GetStartedButton() {
	const { session, isPending } = useAuth();
	const href = session ? "/profile" : "/auth/login";

	return (
		<>
			<Button
				asChild
				size="lg"
				className={isPending ? "pointer-events-none opacity-50" : undefined}
			>
				<Link href={href}>
					{isPending ? "Loading..." : session ? "Get Started" : "Sign Up"}
				</Link>
			</Button>
			{session && (
				<p className="flex items-center gap-2">
					<span
						data-role={session.user.role}
						className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600"
					/>
					Welcome back {session.user?.name} !
				</p>
			)}
		</>
	);
}
