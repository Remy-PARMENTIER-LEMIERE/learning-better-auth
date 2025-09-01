"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

interface SignInOAuthButtonProps {
	provider: "google" | "github";
	signUp?: boolean;
}

export default function SignInOAuthButton({
	provider,
	signUp,
}: SignInOAuthButtonProps) {
	const action = signUp ? "Up" : "In";
	const providerName = provider === "google" ? "Google" : "GitHub";

	const [isPending, setIsPending] = useState(false);

	const handleClick = async () => {
		await signIn.social({
			provider,
			callbackURL: "/profile",
			errorCallbackURL: "/auth/login/error",
			fetchOptions: {
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);
				},
				onError: (ctx) => {
					toast.error(
						ctx.error?.message ||
							`Error during Sign-${action} with ${providerName}`,
					);
				},
			},
		});
	};

	return (
		<Button onClick={handleClick} disabled={isPending} className="w-50 mx-auto">
			Sign-{action} with {providerName}
		</Button>
	);
}
