import { useRouter } from "next/router";

interface NavigationButtonProps {
    symbolFocus: string
    symbolNeutral: string;
    link: string;
    children?: React.ReactNode;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ symbolFocus, symbolNeutral, link, children}) => {
    const router = useRouter();

    const isActive = (path: string) => {
        const pathname = router.pathname;
        if (pathname === "/[slug]") {
            const { slug } = router.query;
            if (typeof slug !== "string") throw new Error("invalid slug");
            return `/${slug}` === path
        }
        return pathname === path;
    }

    return (
    <a
          href={link}
          role="link"
          className="flex items-center"
        >
          <div className="flex flex-row gap-4 rounded-full border-slate-200 px-3 py-2 pr-6 hover:bg-slate-200 hover:bg-opacity-10">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-slate-200 fill-current h-[22px] w-[22px]"
          >
            {isActive(link) ? <path d={symbolFocus} /> : <path d={symbolNeutral} />} 
          </svg>
          <span className={`font-segoe text-base ${isActive(link) ? "font-[650]" : ""}`}>{children}</span>
          </div>
        </a>
    )
}