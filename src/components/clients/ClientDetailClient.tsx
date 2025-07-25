'use client';

import type { Client } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/helpers/date-helpers';

function DetailItem({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string | number | undefined | null;
  isLink?: boolean;
}) {
  if (!value) {
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

export function ClientDetailClient({ client }: { client: Client }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Client Name" value={client.basicInfo.clientName} />
          <DetailItem label="Client Code" value={client.clientCode} />
          <DetailItem label="Industry" value={client.basicInfo.industry} />
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
          <CardTitle>Commercials</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Billing Currency"
            value={client.commercial.billingCurrency}
          />
          <DetailItem
            label="Active Projects"
            value={client.analytics.activeProjectsCount}
          />
          <DetailItem
            label="Total Projects"
            value={client.analytics.totalProjectsCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
