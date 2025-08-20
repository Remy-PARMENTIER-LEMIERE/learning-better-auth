"use client";

import { useAuth } from "@/lib/AuthContext";
import LoginButton from "./login-button";
import SignOutButton from "./sign-out-button";

export default function Header() {
	const { session } = useAuth();

	return (
		<header className="flex justify-end-safe p-1 gap-2">
			{session ? <SignOutButton /> : <LoginButton />}
		</header>
	);
}
