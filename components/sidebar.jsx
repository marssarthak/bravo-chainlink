import Link from "next/link";

export const Sidebar = async () => {
    return (
        <div>
            <ul>
                <li className={isActive("/") ? "text-blue-500" : ""}>
                    <div className="relative inline-block w-full text-left">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/"
                        >
                            Home
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
};
