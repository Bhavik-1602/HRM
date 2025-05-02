"use client";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome=()=>{
    router.push("/")
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col justify-center items-center bg-white p-6 lg:p-8 rounded-2xl shadow-xl max-w-[500px] w-full">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-orange-500">
          404
        </h2>
        <p className="text-md md:text-lg text-gray-600 text-center mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button className="bg-[#F47B55] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#e66942] hover:cursor-pointer shadow-md hover:shadow-lg"
        onClick={handleGoHome}
        >
          Go back to Home
        </button>
      </div>
    </div>
  );
}
