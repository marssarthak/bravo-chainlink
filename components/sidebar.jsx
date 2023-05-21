import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";

export function Sidebar() {
    // const router = useRouter();

    // const isActive = (pathname) => {
    //     return router.pathname === pathname;
    // };

    return (
        <div className="width-[10%]">
            <ul className="flex flex-col p-4 bg-black text-white">
                {/* <li className={isActive("/") ? "text-blue-500" : ""}> */}
                <li>
                    <div className="relative inline-block w-full text-left">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/app/dashboard"
                        >
                            Dashboard
                        </Link>
                    </div>
                </li>
                <li>
                <div className="relative inline-block w-full text-left">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/app/"
                        >
                            Other feature
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
        // <div>sidebar</div>
    );
};
