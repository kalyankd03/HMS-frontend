'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { billingApi } from '@/lib/api';
import { getStoredToken } from '@hms/core';
import type { BillingDocument, PaymentRecord } from '@hms/core';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(Number(value) || 0);

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
};

export default function PaymentsPage() {
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }

    const { from, to } = getTodayRange();

    try {
      setLoading(true);
      setError(null);
      const [docs, pays] = await Promise.all([
        billingApi.listDocuments({ from_date: from, to_date: to }, token),
        billingApi.listPayments({ from_date: from, to_date: to }, token),
      ]);
      setDocuments(docs);
      setPayments(pays);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load billing data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const completedBills = useMemo(
    () => documents.filter((doc) => doc.status === 'finalized'),
    [documents]
  );

  const ongoingBills = useMemo(
    () => documents.filter((doc) => doc.status !== 'finalized'),
    [documents]
  );

  const totals = useMemo(() => {
    const totalNet = completedBills.reduce((sum, doc) => sum + (doc.net_total ?? 0), 0);
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount ?? 0), 0);
    const totalOutstanding = completedBills.reduce(
      (sum, doc) => sum + (doc.balance_due ?? 0),
      0
    );
    return {
      totalNet,
      totalPaid,
      totalOutstanding,
    };
  }, [completedBills, payments]);

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-sm text-muted-foreground">
            Review today&apos;s billing documents and recorded payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => void loadData()} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totals.totalNet)}</div>
            <p className="text-xs text-muted-foreground">
              {completedBills.length} finalized bill{completedBills.length === 1 ? '' : 's'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payments Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totals.totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length} payment{payments.length === 1 ? '' : 's'} recorded today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totals.totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">Across finalized bills</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Finalized Bills
            </CardTitle>
            <CardDescription>Completed billing documents for today</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading finalized bills...
              </div>
            ) : completedBills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No finalized bills recorded today.
              </p>
            ) : (
              <div className="space-y-4">
                {completedBills.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{doc.bill_number}</p>
                        <p className="text-xs text-muted-foreground">
                          Patient #{doc.patient_id} • {formatDateTime(doc.finalized_at)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        Finalized
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-medium">{formatCurrency(doc.net_total)}</span>
                      <span className="text-muted-foreground">
                        Paid: {formatCurrency(doc.amount_paid)}
                      </span>
                      <span className="text-muted-foreground">
                        Due: {formatCurrency(doc.balance_due)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Ongoing Bills
            </CardTitle>
            <CardDescription>Draft and in-progress billing documents for today</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading ongoing bills...
              </div>
            ) : ongoingBills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ongoing bills at the moment.
              </p>
            ) : (
              <div className="space-y-4">
                {ongoingBills.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{doc.bill_number}</p>
                        <p className="text-xs text-muted-foreground">
                          Patient #{doc.patient_id} • {formatDateTime(doc.created_at)}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 text-amber-600">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {doc.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Estimated: {formatCurrency(doc.net_total)}</span>
                      <span>Paid: {formatCurrency(doc.amount_paid)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments Recorded Today</CardTitle>
          <CardDescription>Detailed log of payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payments recorded yet today.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{payment.payment_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(payment.payment_date)} • Patient #{payment.patient_id}
                      </p>
                    </div>
                    <Badge variant="secondary">{payment.payment_method}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    <span className="text-muted-foreground capitalize">{payment.status}</span>
                    {payment.reference_number ? (
                      <span className="text-muted-foreground">
                        Ref: {payment.reference_number}
                      </span>
                    ) : null}
                  </div>
                  {payment.notes ? (
                    <p className="text-xs text-muted-foreground">Notes: {payment.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
