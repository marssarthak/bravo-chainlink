import { Sidebar } from "@/components/sidebar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <div>
            {/* <Sidebar /> */}
            <Component {...pageProps} />
        </div>
    );
}
