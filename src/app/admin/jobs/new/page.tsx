import AdminPageHeader from "@/components/admin/AdminPageHeader";
import JobForm from "../../_components/JobForm";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateJobPage() {
    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Post new job"
                description="Create a listing for the careers site"
            />
            <Card className="bg-white">
                <CardContent className="p-5 sm:p-6">
                    <JobForm />
                </CardContent>
            </Card>
        </div>
    );
}
