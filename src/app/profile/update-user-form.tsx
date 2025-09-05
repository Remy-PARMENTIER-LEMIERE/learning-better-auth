"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";

interface UpdateUserFormProps {
	name: string;
	image: string;
}

export default function UpdateUserForm({ name, image }: UpdateUserFormProps) {
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const image = formData.get("image") as string;

		if (!name) {
			toast.error("Name is required");
			setIsPending(false);
			return;
		}

		try {
			await updateUser({
				name: name && name,
				image: image && image,
				fetchOptions: {
					onRequest: () => setIsPending(true),
					onResponse: () => setIsPending(false),
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
					onSuccess: () => {
						toast.success("User updated successfully");
						router.refresh();
					},
				},
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to update user");
			}
		}
	}

	return (
		<form
			className="max-w-sm w-full space-y-4 mx-auto flex flex-col"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-2">
				<Label className="font-medium" htmlFor="name">
					Name
				</Label>
				<Input id="name" defaultValue={name} name="name" required />
			</div>

			<div className="flex flex-col gap-2">
				<Label className="font-medium" htmlFor="image">
					Image
				</Label>
				<Input
					id="image"
					defaultValue={image}
					name="image"
					placeholder="https://example.com/image.jpg"
					type="url"
				/>
			</div>

			<Button
				type="submit"
				className="mt-4 inline-block w-1/4 place-self-end"
				disabled={isPending}
			>
				{!isPending ? "Update" : <Loader2 className="animate-spin" />}
			</Button>
		</form>
	);
}
