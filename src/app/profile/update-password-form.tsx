"use client";

import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import changePasswordAction from "@/actions/auth/change-password.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordSchema } from "@/lib/utils";

const initialState = { status: "", message: "" };

export default function UpdatePasswordForm() {
	const [state, action, isPending] = useActionState(
		changePasswordAction,
		initialState,
	);
	const changePasswordFormRef = useRef<HTMLFormElement>(null);
	const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
		useState(false);
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	useEffect(() => {
		if (state.status === "success") {
			toast.success(state.message || "Password changed successfully.");
			changePasswordFormRef.current?.reset();
		} else if (state.status === "error") {
			toast.error(
				state.message || "An error occurred while changing the password.",
			);
		}
	}, [state]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const currentPassword = String(formData.get("current-password"));
		const newPassword = String(formData.get("new-password"));
		const confirmPassword = String(formData.get("confirm-password"));

		if (!currentPassword || !newPassword || !confirmPassword) {
			return toast.error("All fields are required.");
		}
		if (!passwordSchema.safeParse({ password: newPassword }).success) {
			return toast.error(
				passwordSchema.safeParse({ password: newPassword }).error?.message,
			);
		}
		if (newPassword !== confirmPassword) {
			return toast.error("New passwords do not match.");
		}

		startTransition(() => {
			action(formData);
		});
	};

	return (
		<form
			className="max-w-sm w-full space-y-4 mx-auto flex flex-col"
			onSubmit={handleSubmit}
			ref={changePasswordFormRef}
		>
			<div className="flex flex-col gap-2">
				<Label className="font-medium" htmlFor="current-password">
					Current Password
				</Label>
				<div className="grid">
					<Input
						id="current-password"
						placeholder="Current Password"
						name="current-password"
						type={isCurrentPasswordVisible ? "text" : "password"}
						className="col-start-1 row-start-1"
					/>
					<button
						type="button"
						className="col-start-1 row-start-1 justify-self-end cursor-pointer mr-2"
						onClick={() => {
							setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
						}}
						tabIndex={-1}
						title="Afficher/Masquer le mot de passe"
					>
						{isCurrentPasswordVisible ? <EyeIcon /> : <EyeClosedIcon />}
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label className="font-medium" htmlFor="new-password">
					New Password
				</Label>
				<div className="grid">
					<Input
						id="new-password"
						placeholder="New Password"
						name="new-password"
						required
						type={isNewPasswordVisible ? "text" : "password"}
						className="col-start-1 row-start-1"
					/>
					<button
						type="button"
						className="col-start-1 row-start-1 justify-self-end cursor-pointer mr-2"
						onClick={() => {
							setIsNewPasswordVisible(!isNewPasswordVisible);
						}}
						tabIndex={-1}
						title="Afficher/Masquer le mot de passe"
					>
						{isNewPasswordVisible ? <EyeIcon /> : <EyeClosedIcon />}
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label className="font-medium" htmlFor="confirm-password">
					Confirm Password
				</Label>
				<div className="grid">
					<Input
						id="confirm-password"
						placeholder="Confirm Password"
						name="confirm-password"
						required
						type={isConfirmPasswordVisible ? "text" : "password"}
						className="col-start-1 row-start-1"
					/>
					<button
						type="button"
						className="col-start-1 row-start-1 justify-self-end cursor-pointer mr-2"
						onClick={() => {
							setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
						}}
						tabIndex={-1}
						title="Afficher/Masquer le mot de passe"
					>
						{isConfirmPasswordVisible ? <EyeIcon /> : <EyeClosedIcon />}
					</button>
				</div>
			</div>

			<Button
				type="submit"
				className="mt-4 inline-block w-1/4 place-self-end min-w-[min-content]"
				disabled={isPending}
			>
				{!isPending ? (
					"Change Password"
				) : (
					<Loader2 className="animate-spin mx-auto" />
				)}
			</Button>
		</form>
	);
}
