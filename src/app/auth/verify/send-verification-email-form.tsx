"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendVerificationEmail } from "@/lib/auth-client";
import { emailSchema } from "@/lib/utils";

export default function SendVerificationEmailForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = String(formData.get("email"));

		if (!email || emailSchema.safeParse({ email }).success === false) {
			return toast.error("Veuillez saisir un email valide.");
		}

		await sendVerificationEmail({
			email,
			callbackURL: "/auth/verify",
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
					formRef.current?.reset();
					toast.success("Un nouveau lien vous a été envoyé par email.");
				},
			},
		});
	};

	return (
		<form
			className="max-w-sm w-full space-y-4"
			onSubmit={handleSubmit}
			ref={formRef}
		>
			<div className="flex flex-col gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					type="email"
					id="email"
					name="email"
					required
					className="border border-gray-300 rounded-md p-2"
				/>
			</div>
			<Button type="submit" disabled={isPending}>
				Envoyer
			</Button>
		</form>
	);
}
