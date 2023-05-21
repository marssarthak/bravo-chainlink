import Link from "next/link";
import { useRouter } from 'next/router';

export const Sidebar = async () => {

    const router = useRouter();

    const isActive = (pathname) => {
      return router.pathname === pathname;
    };

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
