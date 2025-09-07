import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

const transactions = [
    { id: "1", merchant: "Zomato", date: "2023-06-23", amount: "₹450.00", category: "Food" },
    { id: "2", merchant: "Myntra", date: "2023-06-22", amount: "₹2,150.00", category: "Shopping" },
    { id: "3", merchant: "Uber", date: "2023-06-21", amount: "₹280.00", category: "Transport" },
    { id: "4", merchant: "Netflix", date: "2023-06-20", amount: "₹649.00", category: "Bills" },
    { id: "5", merchant: "Apollo Pharmacy", date: "2023-06-19", amount: "₹890.00", category: "Health" },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Recent Transactions
        </CardTitle>
        <CardDescription>A list of your most recent expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
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
                <TableCell className="text-right">{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
