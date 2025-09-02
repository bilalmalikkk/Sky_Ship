import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Search, Download, Trash2, FileText, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileRecord {
  id: string;
  name: string;
  type: "invoice" | "customs" | "manifest" | "other";
  size: string;
  uploadDate: string;
  customer: string;
  shipmentId?: string;
  status: "active" | "archived";
}

const FileManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([
    {
      id: "1",
      name: "Invoice_INV-2024-001.pdf",
      type: "invoice",
      size: "245 KB",
      uploadDate: "2024-01-15",
      customer: "Tech Corp Ltd",
      shipmentId: "SH-001",
      status: "active"
    },
    {
      id: "2",
      name: "Customs_Declaration_CD-2024-002.pdf",
      type: "customs",
      size: "189 KB",
      uploadDate: "2024-01-16",
      customer: "Global Corp",
      shipmentId: "SH-002",
      status: "active"
    },
    {
      id: "3",
      name: "Shipping_Manifest_SM-2024-003.pdf",
      type: "manifest",
      size: "412 KB",
      uploadDate: "2024-01-17",
      customer: "Startup Inc",
      shipmentId: "SH-003",
      status: "active"
    },
    {
      id: "4",
      name: "Product_Images_batch_1.zip",
      type: "other",
      size: "2.1 MB",
      uploadDate: "2024-01-18",
      customer: "Tech Corp Ltd",
      status: "archived"
    }
  ]);

  const [newFile, setNewFile] = useState({
    name: "",
    type: "other" as const,
    customer: "",
    shipmentId: ""
  });

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.shipmentId && file.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = () => {
    if (!newFile.name || !newFile.customer) {
      toast({
        title: "Error",
        description: "File name and customer are required",
        variant: "destructive"
      });
      return;
    }

    const file: FileRecord = {
      id: (files.length + 1).toString(),
      name: newFile.name,
      type: newFile.type,
      size: "125 KB", // Mock size
      uploadDate: new Date().toISOString().split('T')[0],
      customer: newFile.customer,
      shipmentId: newFile.shipmentId || undefined,
      status: "active"
    };

    setFiles([...files, file]);
    setNewFile({ name: "", type: "other", customer: "", shipmentId: "" });
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Success",
      description: "File uploaded successfully"
    });
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    toast({
      title: "Success",
      description: "File deleted successfully"
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "invoice":
      case "customs":
      case "manifest":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "invoice": return "bg-green-100 text-green-800";
      case "customs": return "bg-blue-100 text-blue-800";
      case "manifest": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File Management</CardTitle>
              <CardDescription>Manage documents and files for shipments</CardDescription>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New File</DialogTitle>
                  <DialogDescription>Add a new document or file to the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileName">File Name *</Label>
                    <Input
                      id="fileName"
                      value={newFile.name}
                      onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                      placeholder="Enter file name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileType">File Type</Label>
                    <Select value={newFile.type} onValueChange={(value: any) => setNewFile({...newFile, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="customs">Customs Declaration</SelectItem>
                        <SelectItem value="manifest">Shipping Manifest</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Input
                      id="customer"
                      value={newFile.customer}
                      onChange={(e) => setNewFile({...newFile, customer: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipmentId">Shipment ID (Optional)</Label>
                    <Input
                      id="shipmentId"
                      value={newFile.shipmentId}
                      onChange={(e) => setNewFile({...newFile, shipmentId: e.target.value})}
                      placeholder="Enter shipment ID"
                    />
                  </div>
                  <Button onClick={handleFileUpload} className="w-full">
                    Upload File
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="customs">Customs Declaration</SelectItem>
                <SelectItem value="manifest">Shipping Manifest</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(file.type)} variant="secondary">
                        {file.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.customer}</TableCell>
                    <TableCell>{file.shipmentId || "—"}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.uploadDate}</TableCell>
                    <TableCell>
                      <Badge variant={file.status === "active" ? "default" : "secondary"}>
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileManagement;