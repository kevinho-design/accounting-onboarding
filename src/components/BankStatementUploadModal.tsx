import * as React from "react";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processed' | 'error';
  progress: number;
  accountType?: string;
  dateRange?: string;
  transactionCount?: number;
}

interface BankStatementUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

export function BankStatementUploadModal({ isOpen, onClose, onFilesUploaded }: BankStatementUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id);
    });
  };

  const simulateFileProcessing = (fileId: string) => {
    const updateProgress = (progress: number) => {
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, progress } : file
      ));
    };

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(interval);
        // Simulate processing completion
        setTimeout(() => {
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId ? { 
              ...file, 
              status: 'processed',
              progress: 100,
              accountType: Math.random() > 0.5 ? 'Business Checking' : 'Trust Account',
              dateRange: 'Jan 2024 - Dec 2024',
              transactionCount: Math.floor(Math.random() * 500) + 50
            } : file
          ));
        }, 1000);
      } else {
        updateProgress(progress);
      }
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleAccountTypeChange = (fileId: string, accountType: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, accountType } : file
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const canProceed = uploadedFiles.length > 0 && uploadedFiles.every(file => 
    file.status === 'processed' && file.accountType
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-gray-900">Upload Bank Statements</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Upload PDF, CSV, or Excel files of your bank statements
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto accounting-blue-bg rounded-xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your bank statements here
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Or click to browse your files
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: PDF, CSV, Excel (.xlsx, .xls) • Max file size: 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.csv,.xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="bg-white shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(file.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                              className="text-gray-500 hover:text-red-600 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{formatFileSize(file.size)}</span>
                            {file.status === 'processed' && file.dateRange && (
                              <span>{file.dateRange}</span>
                            )}
                            {file.status === 'processed' && file.transactionCount && (
                              <span>{file.transactionCount} transactions</span>
                            )}
                          </div>

                          {file.status === 'uploading' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Processing...</span>
                                <span className="text-gray-600">{Math.round(file.progress)}%</span>
                              </div>
                              <Progress value={file.progress} className="h-2" />
                            </div>
                          )}

                          {file.status === 'processed' && (
                            <div className="space-y-2">
                              <Label htmlFor={`account-type-${file.id}`} className="text-sm font-medium text-gray-700">
                                Account Type
                              </Label>
                              <Select 
                                value={file.accountType || ""} 
                                onValueChange={(value) => handleAccountTypeChange(file.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white border-gray-200">
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                  <SelectItem value="business_checking">Business Checking</SelectItem>
                                  <SelectItem value="business_savings">Business Savings</SelectItem>
                                  <SelectItem value="trust_account">Trust Account (IOLTA)</SelectItem>
                                  <SelectItem value="credit_card">Credit Card</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {file.status === 'error' && (
                            <div className="text-sm text-red-600">
                              Error processing file. Please try uploading again.
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Processing Summary */}
          {uploadedFiles.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Processing Summary</h4>
                    <p className="text-sm text-blue-700">
                      {uploadedFiles.filter(f => f.status === 'processed').length} of {uploadedFiles.length} files processed successfully. 
                      {uploadedFiles.some(f => !f.accountType) && " Please assign account types to continue."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {uploadedFiles.filter(f => f.status === 'processed').length} files ready to import
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onFilesUploaded?.(uploadedFiles);
                  onClose();
                }} 
                disabled={!canProceed}
                className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white disabled:opacity-50"
              >
                Import Statements
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}