import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  BookOpen,
  UserCheck,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
} from "lucide-react";

interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: "student" | "faculty" | "staff";
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue";
  fine?: number;
  renewalCount: number;
  notes?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: "Available" | "Borrowed" | "Reserved";
}

interface Borrower {
  id: string;
  name: string;
  type: "student" | "faculty" | "staff";
  email: string;
  phone?: string;
  department: string;
}
const dummyBooks: Book[] = [
  {
    id: "1",
    title: "The River and the Source",
    author: "Margaret A. Ogola",
    isbn: "9789966463607",
    status: "Available",
  },
  {
    id: "2",
    title: "Kintu",
    author: "Jennifer Nansubuga Makumbi",
    isbn: "9789987736011",
    status: "Borrowed",
  },
  {
    id: "3",
    title: "Abyssinian Chronicles",
    author: "Moses Isegawa",
    isbn: "9780375705774",
    status: "Reserved",
  },
];

const dummyBorrowers: Borrower[] = [
  {
    id: "1",
    name: "John Doe",
    type: "student",
    email: "john.doe@university.ac.ug",
    phone: "+256701234567",
    department: "Computer Science",
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "faculty",
    email: "jane.smith@university.ac.ug",
    phone: "+256701234568",
    department: "Literature",
  },
  {
    id: "3",
    name: "Michael Otieno",
    type: "staff",
    email: "michael.otieno@university.ac.ug",
    phone: "+256701234569",
    department: "Library",
  },
];

const dummyBorrowings: Borrowing[] = [
  {
    id: "1",
    bookId: "1",
    bookTitle: "The River and the Source",
    borrowerId: "1",
    borrowerName: "John Doe",
    borrowerType: "student",
    borrowDate: new Date().toISOString(),
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 14)
    ).toISOString(),
    status: "active",
    renewalCount: 0,
  },
  {
    id: "2",
    bookId: "2",
    bookTitle: "Kintu",
    borrowerId: "2",
    borrowerName: "Jane Smith",
    borrowerType: "faculty",
    borrowDate: new Date().toISOString(),
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 30)
    ).toISOString(),
    status: "overdue",
    fine: 5,
    renewalCount: 1,
  },
  {
    id: "3",
    bookId: "3",
    bookTitle: "Abyssinian Chronicles",
    borrowerId: "3",
    borrowerName: "Michael Otieno",
    borrowerType: "staff",
    borrowDate: new Date().toISOString(),
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 30)
    ).toISOString(),
    status: "returned",
    returnDate: new Date().toISOString(),
    renewalCount: 0,
  },
];

export function BookBorrowing() {
  const { toast } = useToast();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [statistics, setStatistics] = useState({
    active: 0,
    overdue: 0,
    totalFines: 0,
  });

  useEffect(() => {
    setBooks(dummyBooks);
    setBorrowers(dummyBorrowers);
  }, []);

  useEffect(() => {
    updateStatistics();
    checkOverdueBooks();
  }, [borrowings]);

  const updateStatistics = () => {
    const stats = {
      active: borrowings.filter((b) => b.status === "active").length,
      overdue: borrowings.filter((b) => b.status === "overdue").length,
      totalFines: borrowings.reduce((sum, b) => sum + (b.fine || 0), 0),
    };
    setStatistics(stats);
  };

  const checkOverdueBooks = () => {
    const today = new Date();
    const updatedBorrowings = borrowings.map((borrowing) => {
      if (
        borrowing.status === "active" &&
        new Date(borrowing.dueDate) < today
      ) {
        const daysOverdue = Math.floor(
          (today.getTime() - new Date(borrowing.dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          ...borrowing,
          status: "overdue" as "overdue",
          fine: daysOverdue * 1, // $1 per day
        };
      }
      return borrowing;
    });

    if (JSON.stringify(updatedBorrowings) !== JSON.stringify(borrowings)) {
      setBorrowings(updatedBorrowings);
      const newOverdue = updatedBorrowings.filter(
        (b) =>
          b.status === "overdue" &&
          borrowings.find((old) => old.id === b.id)?.status === "active"
      );

      if (newOverdue.length > 0) {
        toast({
          title: "Overdue Books Detected",
          description: `${newOverdue.length} books are now overdue`,
          variant: "destructive",
        });
      }
    }
  };

  const issueBorrowingCard = (bookId: string, borrowerId: string) => {
    const book = books.find((b) => b.id === bookId);
    const borrower = borrowers.find((b) => b.id === borrowerId);

    if (!book || !borrower) {
      toast({
        title: "Error",
        description: "Please select both book and borrower",
        variant: "destructive",
      });
      return;
    }

    if (book.status !== "Available") {
      toast({
        title: "Error",
        description: "Book is not available for borrowing",
        variant: "destructive",
      });
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(
      dueDate.getDate() + (borrower.type === "student" ? 14 : 30)
    );

    const newBorrowing: Borrowing = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      bookTitle: book.title,
      borrowerId,
      borrowerName: borrower.name,
      borrowerType: borrower.type,
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: "active",
      renewalCount: 0,
    };

    setBorrowings([...borrowings, newBorrowing]);
    setBooks(
      books.map((b) => (b.id === bookId ? { ...b, status: "Borrowed" } : b))
    );

    toast({
      title: "Success",
      description: "Book issued successfully",
    });
  };

  const returnBook = (borrowingId: string) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId);
    if (!borrowing) return;

    const updatedBorrowings = borrowings.map((b) => {
      if (b.id === borrowingId) {
        return {
          ...b,
          status: "returned" as "returned",
          returnDate: new Date().toISOString(),
        };
      }
      return b;
    });

    setBorrowings(updatedBorrowings);
    setBooks(
      books.map((b) =>
        b.id === borrowing.bookId ? { ...b, status: "Available" } : b
      )
    );

    toast({
      title: "Success",
      description: "Book returned successfully",
    });
  };

  const renewBook = (borrowingId: string) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId);
    if (!borrowing || borrowing.renewalCount >= 2) {
      toast({
        title: "Error",
        description: "Maximum renewal limit reached",
        variant: "destructive",
      });
      return;
    }

    const dueDate = new Date(borrowing.dueDate);
    dueDate.setDate(
      dueDate.getDate() + (borrowing.borrowerType === "student" ? 7 : 14)
    );

    setBorrowings(
      borrowings.map((b) => {
        if (b.id === borrowingId) {
          return {
            ...b,
            dueDate: dueDate.toISOString(),
            renewalCount: b.renewalCount + 1,
          };
        }
        return b;
      })
    );

    toast({
      title: "Success",
      description: "Book renewed successfully",
    });
  };

  const calculateFine = (borrowing: Borrowing) => {
    if (borrowing.status !== "overdue") return 0;
    const dueDate = new Date(borrowing.dueDate);
    const today = new Date();
    const daysOverdue = Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysOverdue * 1); // $1 per day
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Book Borrowing & Returns</h1>
        <Button className="gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          Issue New Book
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Active Borrowings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Overdue Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {statistics.overdue}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Total Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statistics.totalFines.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search borrowings..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Borrowings Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowings.map((borrowing) => (
            <TableRow key={borrowing.id}>
              <TableCell>{borrowing.bookTitle}</TableCell>
              <TableCell>{borrowing.borrowerName}</TableCell>
              <TableCell>
                {new Date(borrowing.borrowDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(borrowing.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    borrowing.status === "active"
                      ? "default"
                      : borrowing.status === "overdue"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {borrowing.status}
                </Badge>
              </TableCell>
              <TableCell>${borrowing.fine?.toFixed(2) || "0.00"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {borrowing.status !== "returned" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => returnBook(borrowing.id)}
                      >
                        Return
                      </Button>
                      {borrowing.renewalCount < 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => renewBook(borrowing.id)}
                        >
                          Renew
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
