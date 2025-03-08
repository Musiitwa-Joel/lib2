import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Trash2, Edit2, BookOpen, Users, Library, Filter, Download, MoreVertical } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  faculty: string;
  status: 'Available' | 'Borrowed' | 'Reserved';
  edition?: string;
  publisher?: string;
  publicationYear?: string;
  copies: number;
  location?: string;
  description?: string;
  coverImage?: string;
  lastUpdated: string;
  barcode?: string;
  acquisitionDate?: string;
  price?: number;
  language?: string;
  tags?: string[];
}

const FACULTIES = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Law', 'Science'];
const SUBJECTS = ['Programming', 'Database Systems', 'Networking', 'Mathematics', 'Physics', 'Chemistry', 'Literature'];
const LANGUAGES = ['English', 'French', 'Spanish', 'Arabic', 'Chinese', 'German'];

export function BookManagement() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Partial<Book>>({});
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaculty, setFilterFaculty] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statistics, setStatistics] = useState({
    total: 0,
    available: 0,
    borrowed: 0,
    reserved: 0,
    totalValue: 0,
  });

  useEffect(() => {
    updateStatistics();
  }, [books]);

  const updateStatistics = () => {
    const stats = {
      total: books.length,
      available: books.filter(b => b.status === 'Available').length,
      borrowed: books.filter(b => b.status === 'Borrowed').length,
      reserved: books.filter(b => b.status === 'Reserved').length,
      totalValue: books.reduce((sum, book) => sum + (book.price || 0), 0),
    };
    setStatistics(stats);
  };

  const handleSort = (key: keyof Book) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortConfig.key as keyof Book] < b[sortConfig.key as keyof Book]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof Book] > b[sortConfig.key as keyof Book]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm) ||
      book.barcode?.includes(searchTerm);
    const matchesFaculty = !filterFaculty || book.faculty === filterFaculty;
    const matchesStatus = !filterStatus || book.status === filterStatus;
    return matchesSearch && matchesFaculty && matchesStatus;
  });

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const addOrUpdateBook = () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const book: Book = {
      id: editingBook?.id || Math.random().toString(36).substr(2, 9),
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      subject: newBook.subject || '',
      faculty: newBook.faculty || '',
      status: newBook.status || 'Available',
      copies: newBook.copies || 1,
      edition: newBook.edition,
      publisher: newBook.publisher,
      publicationYear: newBook.publicationYear,
      location: newBook.location,
      description: newBook.description,
      coverImage: newBook.coverImage,
      lastUpdated: new Date().toISOString(),
      barcode: newBook.barcode || generateBarcode(),
      acquisitionDate: newBook.acquisitionDate || new Date().toISOString(),
      price: newBook.price,
      language: newBook.language,
      tags: newBook.tags,
    };

    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? book : b));
      toast({
        title: "Success",
        description: "Book updated successfully"
      });
    } else {
      setBooks([...books, book]);
      toast({
        title: "Success",
        description: "Book added successfully"
      });
    }

    setNewBook({});
    setEditingBook(null);
  };

  const generateBarcode = () => {
    return 'LIB-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Subject', 'Faculty', 'Status', 'Copies'];
    const csvContent = [
      headers.join(','),
      ...filteredBooks.map(book => 
        [book.title, book.author, book.isbn, book.subject, book.faculty, book.status, book.copies].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `library_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const bulkDelete = () => {
    if (selectedBooks.size === 0) return;
    
    setBooks(books.filter(book => !selectedBooks.has(book.id)));
    setSelectedBooks(new Set());
    toast({
      title: "Success",
      description: `Deleted ${selectedBooks.size} books successfully`
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Book Management</h1>
        <div className="flex gap-4">
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={bulkDelete} variant="destructive" className="gap-2" 
                 disabled={selectedBooks.size === 0}>
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedBooks.size})
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        {/* Similar cards for Available, Borrowed, Reserved, Total Value */}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search books..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterFaculty} onValueChange={setFilterFaculty}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Faculty" />
          </SelectTrigger>
          <SelectContent>
            {FACULTIES.map(faculty => (
              <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Similar Select for Status */}
      </div>

      {/* Book Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>
                <Badge variant={
                  book.status === 'Available' ? 'default' :
                  book.status === 'Borrowed' ? 'secondary' : 'outline'
                }>
                  {book.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingBook(book)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {/* View details */}}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}