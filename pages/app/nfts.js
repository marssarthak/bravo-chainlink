import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function Nfts() {
    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div>
                    <div>Mint Nft</div>
                </div>
            </div>
        </div>
    );
}
