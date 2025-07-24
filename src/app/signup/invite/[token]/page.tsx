'use server';

import { getInvitationByToken } from '@/services/invitation.services';
import { AcceptInvitationForm } from '@/components/auth/AcceptInvitationForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AcceptInvitationPage({
  params,
}: {
  params: { token: string };
}) {
  const invitation = await getInvitationByToken(params.token);

  const renderInvalidInvitation = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Invalid Invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          This invitation link is either invalid or has expired. Please request
          a new invitation from your administrator.
        </CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {invitation ? (
        <AcceptInvitationForm invitation={invitation} />
      ) : (
        renderInvalidInvitation()
      )}
    </div>
  );
}
