
"use client";

import { useState } from "react";
import { automaticExpenseCategorization } from "@/ai/flows/automatic-expense-categorization";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { FilePlus2, Loader2, Sparkles, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Others"];

export default function ExpensesPage() {
  const { transactions, loading, deleteTransaction } = useUserData();
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
    <div className="grid gap-6 lg:grid-cols-3 auto-rows-max">
      <div className="lg:col-span-2">
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
            {loading ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> : 
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
      <div>
        <AiCategorizationCard onAddTransaction={() => {}} />
      </div>
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

function AiCategorizationCard({ onAddTransaction }: { onAddTransaction: (t: any) => void }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { addTransaction: addUserTransaction } = useUserData();

  const handleCategorize = async () => {
    if (!text.trim()) {
      toast({ variant: "destructive", title: "Input is empty", description: "Please paste a notification text." });
      return;
    }
    setIsLoading(true);
    try {
      const result = await automaticExpenseCategorization({ notificationText: text });
      if (result.category && result.amount && result.merchant) {
        const newTransaction = {
          merchant: result.merchant,
          amount: result.amount,
          category: categories.includes(result.category) ? result.category : "Others",
        };
        await addUserTransaction(newTransaction);
        toast({
          title: "Expense Categorized!",
          description: `${result.merchant} for ${formatCurrency(result.amount)} was added to ${newTransaction.category}.`,
        });
        setText("");
      } else {
        toast({
          variant: "destructive",
          title: "Categorization Failed",
          description: "Could not extract full expense details. Please add manually.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "An Error Occurred", description: "Could not categorize the expense." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          AI Categorization
        </CardTitle>
        <CardDescription>
          Paste an SMS or UPI notification to categorize it automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder={`e.g., 'Payment of ${formatCurrency(450)} to Zomato from your account...'`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <Button onClick={handleCategorize} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Categorize with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
