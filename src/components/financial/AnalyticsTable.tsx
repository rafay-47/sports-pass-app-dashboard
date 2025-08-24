import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { type CheckInAnalytics } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface AnalyticsTableProps {
  analytics: CheckInAnalytics[];
}

export default function AnalyticsTable({ analytics }: AnalyticsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in Analytics</CardTitle>
        <CardDescription>
          Daily check-in counts and revenue generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check-ins</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Avg per Check-in</TableHead>
              <TableHead>Membership Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.slice(-10).reverse().map((analytic, index) => (
              <TableRow key={index}>
                <TableCell>
                  {formatDate(analytic.date)}
                </TableCell>
                <TableCell className="font-medium">
                  {analytic.checkIns}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatCurrency(analytic.revenue)}
                </TableCell>
                <TableCell>
                  {formatCurrency(Math.round(analytic.revenue / analytic.checkIns))}
                </TableCell>
                <TableCell>
                  <Badge className={
                    analytic.membershipType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                    analytic.membershipType === 'standard' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {analytic.membershipType}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}