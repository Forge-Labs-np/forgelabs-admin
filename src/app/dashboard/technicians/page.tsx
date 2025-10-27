import { columns } from "./components/columns";
import { DataTable } from "../components/data-table";
import { technicians } from "@/lib/data";

export default async function TechniciansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold">Technicians</h1>
        <p className="text-muted-foreground">
          View and manage your support technicians.
        </p>
      </div>
      <DataTable columns={columns} data={technicians} />
    </div>
  );
}
