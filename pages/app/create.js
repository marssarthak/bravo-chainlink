import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="flex mt-16">
                <Sidebar />
                <div className="p-4 sm:ml-64">
                    <div>Create</div>
                </div>
            </div>
        </div>
    );
}
