
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { FilePlus2, Loader2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ReceiptScannerCard } from "@/components/dashboard/receipt-scanner-card";
import { Skeleton } from "@/components/ui/skeleton";


const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Others"];

export default function ExpensesPage() {
  const { transactions, loading } = useUserData();
  const { formatCurrency } = useCurrency();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
        console.error("Failed to delete transaction", error);
    }
  };

  return (
    <div className="grid gap-6 auto-rows-max">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Expenses</CardTitle>
            <CardDescription>View and manage all your transactions.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus2 className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseDialog onAddTransaction={() => setIsDialogOpen(false)} />
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading.transactions ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-4 w-[100px]" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-[80px]" />
                    </div>
                ))}
              </div>
          ) : 
          <>
              {/* Desktop Table */}
              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.merchant}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(transaction.date), 'PPP')}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                {transactions.map(transaction => (
                   <Card key={transaction.id} className="w-full">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col space-y-1">
                                <span className="font-medium">{transaction.merchant}</span>
                                <span className="text-sm text-muted-foreground">{format(new Date(transaction.date), 'PPP')}</span>
                                <Badge variant="outline" className="w-fit">{transaction.category}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-lg">{formatCurrency(transaction.amount)}</div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
                ))}
              </div>
          </>
          }
        </CardContent>
      </Card>
    </div>
  );
}

function AddExpenseDialog({ onAddTransaction }: { onAddTransaction: () => void }) {
  const { currency } = useCurrency();
  const { addTransaction: addUserTransaction } = useUserData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTransaction = {
      merchant: formData.get("merchant") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
    };
    try {
        await addUserTransaction(newTransaction);
        onAddTransaction();
    } catch(error) {
        console.error("Failed to add transaction", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogDescription>
          Manually add an expense to your transaction list.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" placeholder="e.g., Zomato" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({currency})</Label>
          <Input id="amount" name="amount" type="number" step="0.01" placeholder="e.g., 450.50" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit">Add Transaction</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
