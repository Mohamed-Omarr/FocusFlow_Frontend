"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value) => router.replace(pathname, { locale: value })}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">Arabic</SelectItem>
        <SelectItem value="tr">Turkish</SelectItem>
      </SelectContent>
    </Select>
  );
}
