import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { allocations } from '@/lib/placeholder-data';
import { Users, GanttChartSquare } from 'lucide-react';


function AllocationsContent() {
  const projects = [...new Set(allocations.map((a) => a.projectName))];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Allocation Board" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GanttChartSquare className="h-5 w-5 text-primary" />
                {project}
              </CardTitle>
              <CardDescription>
                Client: {allocations.find((a) => a.projectName === project)?.clientName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Allocated Resources</span>
                </div>
                <Separator />
                <ul className="space-y-2">
                  {allocations
                    .filter((a) => a.projectName === project)
                    .map((allocation) => (
                      <li
                        key={allocation.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{allocation.resourceName}</span>
                        <span className="font-mono text-muted-foreground">
                          {allocation.percentage}%
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {projects.length === 0 && (
         <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                    <p>No active allocations.</p>
                    <p>Assign resources to projects to see them here.</p>
                </div>
            </CardContent>
         </Card>
      )}
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
