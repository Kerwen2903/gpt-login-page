"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import type { Language } from "@/lib/i18n"

const languageNames: Record<Language, string> = {
  ru: "Русский",
  tk: "Türkmençe",
}

const languageFlags: Record<Language, string> = {
  ru: "🇷🇺",
  tk: "🇹🇲",
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[language]}</span>
          <span className="sm:hidden">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageNames).map(([lang, name]) => (
          <DropdownMenuItem key={lang} onClick={() => setLanguage(lang as Language)} className="gap-2">
            <span>{languageFlags[lang as Language]}</span>
            <span>{name}</span>
            {language === lang && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
