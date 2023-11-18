import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui";
import { locales, useLocale } from "~/features/i18n/hooks/useLocale";

export const LanguageSwitcher = () => {
  const { t, locale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="xs" aria-label="Language" variant="outline">
          {t(locale, locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((e) => (
          <DropdownMenuItem key={e} asChild>
            <a href={e === "ja" ? "/" : `/${e}`}>{t(e, e)}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
