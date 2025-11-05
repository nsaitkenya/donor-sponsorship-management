"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Search, Filter } from "lucide-react"
import type { Donation } from "@/lib/types"

interface DonationWithDonor extends Donation {
  donors?: {
    profiles?: {
      full_name: string | null
      email: string
    }
  } | null
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DonationWithDonor[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<DonationWithDonor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<DonationWithDonor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, statusFilter])

  const fetchTransactions = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("donations")
      .select("*, donors(*, profiles(full_name, email))")
      .order("created_at", { ascending: false })

    if (data) {
      setTransactions(data as DonationWithDonor[])
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.payment_status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.donors?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.donors?.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered)
  }

  const handleUpdateStatus = async () => {
    if (!selectedTransaction || !newStatus) return

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("donations")
      .update({
        payment_status: newStatus,
        processed_at: newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", selectedTransaction.id)

    if (!error) {
      await fetchTransactions()
      setIsDialogOpen(false)
      setSelectedTransaction(null)
      setNewStatus("")
      setNotes("")
    }

    setIsLoading(false)
  }

  const openUpdateDialog = (transaction: DonationWithDonor) => {
    setSelectedTransaction(transaction)
    setNewStatus(transaction.payment_status)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/portal/finance">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">All Transactions</CardTitle>
              <CardDescription>View and manage all donation transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by reference, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-lg">
                            {transaction.currency} {transaction.amount.toLocaleString()}
                          </p>
                          <Badge
                            variant={
                              transaction.payment_status === "completed"
                                ? "default"
                                : transaction.payment_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {transaction.payment_status}
                          </Badge>
                          <Badge variant="outline">{transaction.donation_type.replace("_", " ")}</Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Donor:</span>{" "}
                            {transaction.donors?.profiles?.full_name || "Anonymous"}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Email:</span> {transaction.donors?.profiles?.email || "N/A"}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Method:</span> {transaction.payment_method.replace("_", " ")}
                          </p>
                          {transaction.transaction_reference && (
                            <p className="text-muted-foreground font-mono text-xs">
                              <span className="font-medium">Ref:</span> {transaction.transaction_reference}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openUpdateDialog(transaction)}>
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No transactions found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transaction Status</DialogTitle>
            <DialogDescription>Change the status of this donation transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="font-semibold">
                  {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTransaction.donors?.profiles?.full_name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground font-mono">{selectedTransaction.transaction_reference}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this status change..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
