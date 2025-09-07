"use client";

import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function MagicLinkLoginForm() {
	const detailsRef = useRef<HTMLDetailsElement>(null);
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const name = email.split("@")[0];
		const form = event.target as HTMLFormElement;

		await signIn.magicLink({
			email,
			name,
			callbackURL: "/profile",
			fetchOptions: {
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
				onSuccess: () => {
					toast.success("Magic link sent! Check your email.");
					form.reset();
					detailsRef.current?.removeAttribute("open");
				},
			},
		});
	}

	return (
		<details
			ref={detailsRef}
			className="max-w-sm mx-auto rounded-md border border-purple-600 overflow-hidden"
		>
			<summary className="flex gap-2 items-center px-2 py-1 bg-purple-600 text-white hover:bg-purple-600/80 transition cursor-pointer">
				Try Magic Link <StarIcon size={16} />
			</summary>
			<form onSubmit={handleSubmit} className="px-2 py-1">
				<Label htmlFor="email" className="sr-only">
					Email
				</Label>

				<div className="flex gap-2 items-center">
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Your email"
						required
					/>
					<Button type="submit" disabled={isPending}>
						Send
					</Button>
				</div>
			</form>
		</details>
	);
}
