import Link from "next/link";
import { ConnectKitButton } from "connectkit";

export function Navbar() {

    return (
        <div>
            <ul className="flex p-4 gap-[70%] h-[75px] justify-center bg-black text-white">
                <li>
                    <div className="relative inline-block w-full text-left">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/"
                        >
                            Home
                        </Link>
                    </div>
                </li>
                <li>
                    <ConnectKitButton />
                </li>
            </ul>
        </div>
        // <div>sidebar</div>
    );
};
