
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
  CardFooter,
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
import { FilePlus2, Loader2, Sparkles, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Transaction = {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  category: string;
};

const initialTransactions: Transaction[] = [
  { id: "1", merchant: "Zomato", date: "2023-06-23", amount: 450.0, category: "Food" },
  { id: "2", merchant: "Myntra", date: "2023-06-22", amount: 2150.0, category: "Shopping" },
  { id: "3", merchant: "Uber", date: "2023-06-21", amount: 280.0, category: "Transport" },
  { id: "4", merchant: "Netflix", date: "2023-06-20", amount: 649.0, category: "Bills" },
  { id: "5", merchant: "Apollo Pharmacy", date: "2023-06-19", amount: 890.0, category: "Health" },
  { id: "6", merchant: "Swiggy Instamart", date: "2023-06-18", amount: 1200.0, category: "Food" },
  { id: "7", merchant: "BESCOM", date: "2023-06-17", amount: 1500.0, category: "Bills" },
];

const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Others"];

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { formatCurrency } = useCurrency();

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
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
              <AddExpenseDialog onAddTransaction={handleAddTransaction} />
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.merchant}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount)}
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
                              <span className="text-sm text-muted-foreground">{transaction.date}</span>
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
          </CardContent>
        </Card>
      </div>
      <div>
        <AiCategorizationCard onAddTransaction={handleAddTransaction} />
      </div>
    </div>
  );
}

function AddExpenseDialog({ onAddTransaction }: { onAddTransaction: (t: Transaction) => void }) {
  const { currency } = useCurrency();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      merchant: formData.get("merchant") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: new Date().toISOString().split("T")[0],
    };
    onAddTransaction(newTransaction);
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

function AiCategorizationCard({ onAddTransaction }: { onAddTransaction: (t: Transaction) => void }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formatCurrency, currency } = useCurrency();

  const handleCategorize = async () => {
    if (!text.trim()) {
      toast({ variant: "destructive", title: "Input is empty", description: "Please paste a notification text." });
      return;
    }
    setIsLoading(true);
    try {
      const result = await automaticExpenseCategorization({ notificationText: text });
      if (result.category && result.amount && result.merchant) {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          merchant: result.merchant,
          amount: result.amount,
          category: categories.includes(result.category) ? result.category : "Others",
          date: new Date().toISOString().split("T")[0],
        };
        onAddTransaction(newTransaction);
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
