"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function GetStartedButton() {
	const { session, isPending } = useAuth();
	const href = session ? "/profile" : "/auth/login";

	return (
		<>
			<Button asChild size="lg">
				<Link href={href}>
					{isPending ? "Loading..." : session ? "Get Started" : "Sign Up"}
				</Link>
			</Button>
			{session && <p>Welcome back {session.user?.name} !</p>}
		</>
	);
}
