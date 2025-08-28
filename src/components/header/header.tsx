"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import LoginButton from "./login-button";
import SignOutButton from "./sign-out-button";

export default function Header() {
	const { session } = useAuth();

	return (
		<header className="flex justify-between items-center py-1 px-2 gap-2">
			<Link href="/" className="text-3xl font-bold italic text-shadow-2xs">
				BA
			</Link>
			{session ? <SignOutButton /> : <LoginButton />}
		</header>
	);
}
