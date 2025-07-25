'use client';

import { useState, useTransition } from 'react';
import { BrainCircuit, TrendingDown, TrendingUp, Check } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { getDemandForecast } from '@/app/actions/analyticsActions';
import type { ForecastDemandOutput } from '@/ai/flows/demand-forecasting-flow';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function TrendIcon({ trend }: { trend: 'rising' | 'stable' | 'declining' }) {
  switch (trend) {
    case 'rising':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'stable':
      return <Check className="h-5 w-5 text-blue-500" />;
    case 'declining':
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
}

function PredictiveAnalyticsContent() {
  const { companyProfile } = useAuth();
  const [forecast, setForecast] = useState<ForecastDemandOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRunForecast = () => {
    if (companyProfile?.id) {
      startTransition(async () => {
        const result = await getDemandForecast(companyProfile.id);
        setForecast(result);
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Predictive Demand Forecast">
        <Button onClick={handleRunForecast} disabled={isPending}>
          <BrainCircuit className="mr-2 h-4 w-4" />
          {isPending ? 'Analyzing...' : 'Run AI Forecast'}
        </Button>
      </PageHeader>
      <Alert>
        <AlertTitle>How does this work?</AlertTitle>
        <AlertDescription>
          This tool uses the Gemini API to analyze all of your historical and
          current project data. It identifies trends in project types and
          technologies to predict which skills will be most in-demand for your
          company in the next 6-12 months.
        </AlertDescription>
      </Alert>

      {isPending && (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {forecast && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Summary</CardTitle>
              <CardDescription>
                A high-level overview of the predicted demand trends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{forecast.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Demand Trends</CardTitle>
              <CardDescription>
                Predicted demand for key skills and technologies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecast.demandForecast.map((skill, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={skill.trend} />
                      <h4 className="font-semibold">{skill.skill}</h4>
                      <Badge variant="secondary" className="capitalize">
                        {skill.trend}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 pl-7">
                    {skill.reasoning}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>
                Actionable insights for hiring and training.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                {forecast.strategicRecommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function PredictiveAnalyticsPage() {
  return (
    <AppShell>
      <PredictiveAnalyticsContent />
    </AppShell>
  );
}
