import { useRouter } from "next/router"

export const BackButton = () => {
    const router = useRouter()

    const goBack = () => {
        router.back();
    }
    return (
        <button aria-label="Back" role="button" className="border-0 bg-transparent rounded-full p-2 hover:bg-slate-200 hover:bg-opacity-10 mt-3 ml-4 " onClick={() => {
            console.log("Clicked")
            goBack();
        }} type="button">
        <div dir="ltr" className="text-transparent text-gray-200 overflow-hidden flex items-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="text-gray-200 w-6 h-6 fill-current">
            <g>
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
            </g>
            </svg>
            <span className="text-transparent border-b-2 border-gray-200 ml-1"></span>
        </div>
        </button>
    )
}

export default BackButton;