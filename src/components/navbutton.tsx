import Link from "next/link";
import { useRouter } from "next/router";

interface NavigationButtonProps {
    symbolFocus: string
    symbolNeutral: string;
    link: string;
    children?: React.ReactNode;
    disabled: boolean;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ symbolFocus, symbolNeutral, link, children, disabled}) => {
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
      disabled?
        <div className="flex items-center">
          <div className="flex flex-row gap-4 rounded-full border-slate-200 px-3 py-2 pr-6 hover:bg-slate-200 hover:bg-opacity-10 cursor-pointer">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-slate-200 fill-current h-[28px] w-[28px]"
            >
              <path d={symbolNeutral} />
            </svg>
            <span className="font-segoe text-xl">{children}</span>
          </div>
        </div>
        :
    <Link
          href={link}
          role="link"
          className="flex items-center"
        >
          <div className="flex flex-row gap-4 rounded-full border-slate-200 px-3 py-2 pr-6 hover:bg-slate-200 hover:bg-opacity-10">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-slate-200 fill-current h-[28px] w-[28px]"
          >
            {isActive(link) ? <path d={symbolFocus} /> : <path d={symbolNeutral} />} 
          </svg>
          <span className={`font-segoe text-xl ${isActive(link) ? "font-[650]" : ""}`}>{children}</span>
          </div>
        </Link>
    )
}