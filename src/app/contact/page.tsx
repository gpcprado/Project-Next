import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-gray-900 flex flex-col items-center py-20 px-6 text-center">

      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold drop-shadow-sm text-white">
          My Contact
        </h1>
      </div>

      <div className="mt-10 flex flex-col items-center gap-8">
        <div className="rounded-xl shadow-xl p-8 max-w-md w-full bg-gray-800">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-white">Contact Information</h2>
          <p className="text-gray-700 font-bold mb-2 text-white"><b>Email:</b> pradophilipgreg@gmail.com</p>
          <p className="text-gray-700 font-bold mb-2 text-white"><b>Phone:</b> 09301854397</p>
        </div>
        <Link href="/">
          <Button className="mt-6 px-6 py-3 text-lg shadow-md bg-blue-500 hover:bg-gray-500">
            Back to Home
          </Button>
        </Link>

      </div>
    </div>
  );
}
