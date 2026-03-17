import { DashboardShell } from "@/components/DashboardShell";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <DashboardShell>
            <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </DashboardShell>
    );
}
