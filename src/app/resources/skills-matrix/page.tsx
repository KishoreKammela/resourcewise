'use client';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSkillsMatrixData } from '@/app/actions/skillsMatrixActions';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo, useState, useTransition } from 'react';
import type { Resource } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SkillsMatrixData {
  resources: Resource[];
  technicalSkills: string[];
  softSkills: string[];
}

function SkillsMatrixClient() {
  const { companyProfile, loading: authLoading } = useAuth();
  const [data, setData] = useState<SkillsMatrixData | null>(null);
  const [isPending, startTransition] = useTransition();

  const [resourceFilter, setResourceFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showTechnicalSkills, setShowTechnicalSkills] = useState(true);
  const [showSoftSkills, setShowSoftSkills] = useState(false);

  useEffect(() => {
    if (companyProfile?.id) {
      startTransition(async () => {
        const skillsData = await getSkillsMatrixData(companyProfile.id);
        setData(skillsData);
      });
    }
  }, [companyProfile]);

  const filteredResources = useMemo(() => {
    if (!data) {return [];}
    return data.resources.filter((resource) =>
      `${resource.personalInfo.firstName} ${resource.personalInfo.lastName}`
        .toLowerCase()
        .includes(resourceFilter.toLowerCase())
    );
  }, [data, resourceFilter]);

  const filteredSkills = useMemo(() => {
    if (!data) {return [];}
    const skills: string[] = [];
    if (showTechnicalSkills) {skills.push(...data.technicalSkills);}
    if (showSoftSkills) {skills.push(...data.softSkills);}

    return skills.filter((skill) =>
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );
  }, [data, skillFilter, showTechnicalSkills, showSoftSkills]);

  const loading = authLoading || isPending;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data) {
    return <p>No skills data available.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Filter resources..."
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter skills..."
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="technical-skills"
            checked={showTechnicalSkills}
            onCheckedChange={setShowTechnicalSkills}
          />
          <Label htmlFor="technical-skills">Technical</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="soft-skills"
            checked={showSoftSkills}
            onCheckedChange={setShowSoftSkills}
          />
          <Label htmlFor="soft-skills">Soft</Label>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Skills Matrix</CardTitle>
          <CardDescription>
            A grid view of all resources against all skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-auto border rounded-lg">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted z-20 min-w-[200px]">
                    Resource
                  </TableHead>
                  {filteredSkills.map((skill) => (
                    <TableHead key={skill} className="text-center">
                      <div className="flex items-end justify-center h-full">
                        <span
                          className="inline-block"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            whiteSpace: 'nowrap',
                            paddingBottom: '8px',
                          }}
                        >
                          {skill}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium">
                      {resource.personalInfo.firstName}{' '}
                      {resource.personalInfo.lastName}
                    </TableCell>
                    {filteredSkills.map((skill) => {
                      const hasSkill =
                        resource.skills?.technical?.some(
                          (s) => s.skill === skill
                        ) ||
                        resource.skills?.soft?.some((s) => s.skill === skill);
                      return (
                        <TableCell key={skill} className="text-center">
                          {hasSkill && (
                            <Check className="h-5 w-5 mx-auto text-primary" />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SkillsMatrixPage() {
  return (
    <AppShell>
      <PageHeader title="Skills Matrix" />
      <div className="mt-6">
        <SkillsMatrixClient />
      </div>
    </AppShell>
  );
}
