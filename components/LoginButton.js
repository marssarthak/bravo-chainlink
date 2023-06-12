import { Link } from "@mui/material";
import React from "react";
import Loader from "./Loader";
export default function LoginButton({ loading }) {
  if (loading)
    return (
      <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-screen flex justify-center items-center flex-col">
        <Loader />
      </div>
    );
  return (
    <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-screen flex justify-center items-center flex-col">
      <h1 className="text-lg mb-2">You are not logged in</h1>
      <Link className="text-xl " href="/login">
        Login
      </Link>
    </div>
  );
}
