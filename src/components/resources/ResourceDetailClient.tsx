'use client';

import type { Resource } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  if (!value) {
    return null;
  }
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}

function formatDate(
  date: Timestamp | Date | string | undefined
): string | null {
  if (!date) {
    return null;
  }
  let jsDate: Date;
  if (typeof date === 'string') {
    jsDate = new Date(date);
  } else if (date instanceof Date) {
    jsDate = date;
  } else if (date && 'toDate' in date) {
    jsDate = date.toDate();
  } else {
    return null;
  }

  if (isNaN(jsDate.getTime())) {
    return null;
  }

  return format(jsDate, 'PPP');
}

export function ResourceDetailClient({ resource }: { resource: Resource }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailItem label="Resource Code" value={resource.resourceCode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="First Name"
            value={resource.personalInfo.firstName}
          />
          <DetailItem
            label="Last Name"
            value={resource.personalInfo.lastName}
          />
          <DetailItem label="Email" value={resource.personalInfo.email} />
          <DetailItem label="Phone" value={resource.personalInfo.phone} />
          <DetailItem
            label="Date of Birth"
            value={formatDate(resource.personalInfo.dateOfBirth)}
          />
          <DetailItem
            label="Gender"
            value={
              resource.personalInfo.gender
                ? resource.personalInfo.gender.charAt(0).toUpperCase() +
                  resource.personalInfo.gender.slice(1)
                : null
            }
          />
          <DetailItem
            label="Languages Spoken"
            value={resource.personalInfo.languagesSpoken?.join(', ')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Designation"
            value={resource.professionalInfo?.designation}
          />
          <DetailItem
            label="Employment Type"
            value={resource.professionalInfo?.employmentType}
          />
          <DetailItem
            label="Employment Status"
            value={resource.employmentDetails?.status}
          />
          <DetailItem
            label="Availability"
            value={resource.availability?.status}
          />
          <DetailItem
            label="Current Allocation"
            value={`${resource.availability?.currentAllocationPercentage}%`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Technical Skills</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {resource.skills?.technical?.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Soft Skills</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {resource.skills?.soft?.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resource.experience?.previousCompanies?.map((exp, index) => (
            <div key={index} className="p-4 border rounded-md">
              <h4 className="font-bold">{exp.companyName}</h4>
              <p className="text-muted-foreground">{exp.role}</p>
              <p className="text-sm">{exp.duration}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resource.experience?.education?.map((edu, index) => (
            <div key={index} className="p-4 border rounded-md">
              <h4 className="font-bold">{edu.degree}</h4>
              <p className="text-muted-foreground">{edu.institution}</p>
              <p className="text-sm">{edu.year}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resource.experience?.certifications?.map((cert, index) => (
            <div key={index} className="p-4 border rounded-md">
              <h4 className="font-bold">{cert.name}</h4>
              <p className="text-muted-foreground">
                {cert.issuingOrganization}
              </p>
              {cert.issueDate && (
                <p className="text-sm">
                  Issued: {formatDate(cert.issueDate)}
                </p>
              )}
              {cert.expiryDate && (
                <p className="text-sm">
                  Expires: {formatDate(cert.expiryDate)}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
