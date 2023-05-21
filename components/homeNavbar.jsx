import Link from "next/link";

export function HomeNavbar() {

    return (
        <div className="">
            <ul className="flex p-4 gap-[70%] justify-center bg-black text-white">
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
                    <div className="relative inline-block w-full text-left">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/app"
                        >
                            Launch App
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
        // <div>sidebar</div>
    );
}
