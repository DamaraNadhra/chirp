import { useRouter } from "next/router";

export const BackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <button
      aria-label="Back"
      role="button"
      className="ml-4 mt-3 rounded-full border-0 bg-transparent p-2 hover:bg-slate-200 hover:bg-opacity-10"
      onClick={() => {
        console.log("Clicked");
        goBack();
      }}
      type="button"
    >
      <div
        dir="ltr"
        className="flex items-center overflow-hidden text-gray-200 text-transparent"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-current text-gray-200"
        >
          <g>
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
          </g>
        </svg>
        <span className="ml-1 border-b-2 border-gray-200 text-transparent"></span>
      </div>
    </button>
  );
};

export default BackButton;
