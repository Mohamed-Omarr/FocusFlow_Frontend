"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  profileSchema,
  ProfileSchema,
} from "@/lib/zod/settings/validation/profile";
import Image from "next/image";
import { updateProfile } from "@/lib/actions/profile/update-profile";

interface Props {
  avatarUrl: string;
  profileName: string;
  profileEmail: string;
}

export default function ProfileSettings({
  avatarUrl,
  profileName,
  profileEmail,
}: Props) {
  const [preview, setPreview] = useState(avatarUrl);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profileName,
    },
  });

  const watchedUsername = watch("username");
  const watchedAvatar = watch("avatar");

  const hasChanges = watchedUsername !== profileName || !!watchedAvatar;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setValue("avatar", file, { shouldDirty: true });
  };

  const onSubmit = async (data: ProfileSchema) => {
    await updateProfile(data);
    reset({ username: data.username });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 space-y-8"
    >
      {/* Avatar */}
      <div className="flex justify-center border-b pb-8">
        <div className="relative group">
          <Image
            alt="avatar"
            height={100}
            width={100}
            src={preview}
            className="w-32 h-32 rounded-full object-cover border"
          />

          <label
            htmlFor="avatar"
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 "
          >
            <Upload className="text-white" />
          </label>

          <input
            id="avatar"
            type="file"
            accept="image/png,image/jpeg"
            hidden
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex flex-col gap-2">
          <Label>Username</Label>
          <Input {...register("username")} />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input value={profileEmail} disabled />
        </div>

        <button
          type="submit"
          disabled={!hasChanges || isSubmitting}
          className={`px-6 py-3 rounded-xl ${
            hasChanges
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
