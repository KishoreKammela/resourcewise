'use client';
import { useMemo, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SkillsMatrixData {
  resources: Resource[];
  technicalSkills: string[];
  softSkills: string[];
}

export function SkillsMatrixClient({
  initialData,
}: {
  initialData: SkillsMatrixData;
}) {
  const [resourceFilter, setResourceFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showTechnicalSkills, setShowTechnicalSkills] = useState(true);
  const [showSoftSkills, setShowSoftSkills] = useState(false);

  const filteredResources = useMemo(() => {
    return initialData.resources.filter((resource) =>
      `${resource.personalInfo.firstName} ${resource.personalInfo.lastName}`
        .toLowerCase()
        .includes(resourceFilter.toLowerCase())
    );
  }, [initialData.resources, resourceFilter]);

  const filteredSkills = useMemo(() => {
    const skills: string[] = [];
    if (showTechnicalSkills) {
      skills.push(...initialData.technicalSkills);
    }
    if (showSoftSkills) {
      skills.push(...initialData.softSkills);
    }

    return skills.filter((skill) =>
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );
  }, [
    initialData.technicalSkills,
    initialData.softSkills,
    skillFilter,
    showTechnicalSkills,
    showSoftSkills,
  ]);

  if (!initialData) {
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
