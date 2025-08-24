import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { type ServiceCommission } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface CommissionTableProps {
  commissions: ServiceCommission[];
}

export default function CommissionTable({ commissions }: CommissionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Service Commissions</CardTitle>
        <CardDescription>
          15% commission from member service purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.slice(0, 10).map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>
                  {formatDate(commission.date)}
                </TableCell>
                <TableCell>{commission.serviceName}</TableCell>
                <TableCell>{commission.memberName}</TableCell>
                <TableCell>{formatCurrency(commission.amount)}</TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatCurrency(commission.commission)}
                </TableCell>
                <TableCell>
                  <Badge className={
                    commission.status === 'completed' ? 'bg-green-100 text-green-800' :
                    commission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {commission.status}
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