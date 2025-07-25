'use client';

import type { Client, TeamMember } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/helpers/date-helpers';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTeamMembersByCompany } from '@/services/user.services';

function DetailItem({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string | number | undefined | null;
  isLink?: boolean;
}) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {isLink ? (
        <a
          href={value.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-base">{value}</p>
      )}
    </div>
  );
}

function BooleanDetailItem({
  label,
  value,
}: {
  label: string;
  value: boolean | undefined;
}) {
  if (value === undefined || value === null) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span className="text-base">{label}</span>
    </div>
  );
}

export function ClientDetailClient({ client }: { client: Client }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (client.companyId) {
      getTeamMembersByCompany(client.companyId).then(setTeamMembers);
    }
  }, [client.companyId]);

  const accountManager = teamMembers.find(
    (member) => member.id === client.relationship.accountManagerId
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Client Name" value={client.basicInfo.clientName} />
          <DetailItem label="Client Code" value={client.clientCode} />
          <DetailItem label="Client Type" value={client.basicInfo.clientType} />
          <DetailItem label="Industry" value={client.basicInfo.industry} />
          <DetailItem
            label="Company Size"
            value={client.basicInfo.companySize}
          />
          <DetailItem label="Website" value={client.basicInfo.website} isLink />
          <DetailItem label="Status" value={client.relationship.status} />
          <DetailItem
            label="Relationship Since"
            value={formatDate(client.relationship.startDate)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Name" value={client.contactInfo.primary.name} />
          <DetailItem label="Email" value={client.contactInfo.primary.email} />
          <DetailItem label="Phone" value={client.contactInfo.primary.phone} />
          <DetailItem
            label="Designation"
            value={client.contactInfo.primary.designation}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Management</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Account Manager"
            value={
              accountManager
                ? `${accountManager.personalInfo.firstName} ${accountManager.personalInfo.lastName}`
                : 'N/A'
            }
          />
          <DetailItem
            label="Health Score"
            value={`${client.relationship.healthScore}/5`}
          />
          <DetailItem
            label="Satisfaction"
            value={`${client.relationship.satisfactionRating}/5`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commercial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Billing Currency"
            value={client.commercial.billingCurrency}
          />
          <DetailItem
            label="Payment Terms"
            value={client.commercial.paymentTerms}
          />
          <DetailItem
            label="Contract Type"
            value={client.commercial.contractType}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract & Legal</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <BooleanDetailItem
            label="NDA Signed"
            value={client.contract.ndaSigned}
          />
          <BooleanDetailItem
            label="MSA Signed"
            value={client.contract.msaSigned}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem label="Address Line 1" value={client.address.line1} />
          <DetailItem label="Address Line 2" value={client.address.line2} />
          <DetailItem label="City" value={client.address.city} />
          <DetailItem label="State/Province" value={client.address.state} />
          <DetailItem label="Postal Code" value={client.address.postalCode} />
          <DetailItem label="Country" value={client.address.country} />
          <DetailItem label="Timezone" value={client.address.timezone} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Active Projects"
            value={client.analytics.activeProjectsCount}
          />
          <DetailItem
            label="Total Projects"
            value={client.analytics.totalProjectsCount}
          />
          <DetailItem
            label="Total Revenue"
            value={
              client.analytics.totalRevenueGenerated > 0
                ? `$${client.analytics.totalRevenueGenerated.toLocaleString()}`
                : '$0'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
