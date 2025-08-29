"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Sun, Moon, Languages } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
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

export function SettingsMenu() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">{t("settings")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={toggleTheme} className="gap-2">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === "light" ? t("darkMode") : t("lightMode")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {t("language")}
        </div>

        {Object.entries(languageNames).map(([lang, name]) => (
          <DropdownMenuItem key={lang} onClick={() => setLanguage(lang as Language)} className="gap-2 pl-6">
            <span>{languageFlags[lang as Language]}</span>
            <span>{name}</span>
            {language === lang && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
