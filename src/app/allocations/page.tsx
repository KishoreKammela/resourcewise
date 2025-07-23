import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function AllocationsContent() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Allocation Board" />
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocations</CardTitle>
          <CardDescription>
            View and manage project allocations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">
            <p>No active allocations.</p>
            <p>Assign resources to projects to see them here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default function AllocationsPage() {
  return (
    <AppShell>
      <AllocationsContent />
    </AppShell>
  );
}
