import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { PageSEOSetting, PageSEOService } from '@/services/PageSEOService';
import { toast } from '@/components/ui/use-toast';

interface PageIndexingTableProps {
  pages: PageSEOSetting[];
  onRefresh: () => void;
}

const PageIndexingTable: React.FC<PageIndexingTableProps> = ({ pages, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [indexFilter, setIndexFilter] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.page_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || page.page_type === typeFilter;
    const matchesIndex = indexFilter === 'all' || 
                        (indexFilter === 'indexed' && page.is_indexed) ||
                        (indexFilter === 'noindex' && !page.is_indexed);
    
    return matchesSearch && matchesType && matchesIndex;
  });

  const handleToggleIndexing = async (pageId: string, currentIndexed: boolean) => {
    setIsUpdating(pageId);
    try {
      await PageSEOService.updatePageIndexing(pageId, !currentIndexed);
      toast({
        title: "Success",
        description: `Page ${!currentIndexed ? 'indexed' : 'removed from index'} successfully.`,
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating page indexing:', error);
      toast({
        title: "Error",
        description: "Failed to update page indexing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleBulkUpdate = async (indexed: boolean) => {
    if (selectedPages.length === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to update.",
        variant: "destructive",
      });
      return;
    }

    setIsBulkUpdating(true);
    try {
      await PageSEOService.bulkUpdateIndexing(selectedPages, indexed);
      toast({
        title: "Success",
        description: `${selectedPages.length} pages ${indexed ? 'indexed' : 'removed from index'} successfully.`,
      });
      setSelectedPages([]);
      onRefresh();
    } catch (error) {
      console.error('Error bulk updating pages:', error);
      toast({
        title: "Error",
        description: "Failed to update pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages(prev => [...prev, pageId]);
    } else {
      setSelectedPages(prev => prev.filter(id => id !== pageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(filteredPages.map(page => page.id));
    } else {
      setSelectedPages([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Page Indexing Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={indexFilter} onValueChange={setIndexFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by index status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="indexed">Indexed</SelectItem>
              <SelectItem value="noindex">Not Indexed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedPages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedPages.length} pages selected</span>
            <Button 
              size="sm" 
              onClick={() => handleBulkUpdate(true)}
              disabled={isBulkUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Index Selected
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => handleBulkUpdate(false)}
              disabled={isBulkUpdating}
            >
              <EyeOff className="h-3 w-3 mr-1" />
              Remove from Index
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Checkbox
                      checked={filteredPages.length > 0 && selectedPages.length === filteredPages.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Path</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Indexed</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr key={page.id} className="border-b">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedPages.includes(page.id)}
                        onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {page.page_path}
                      </code>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs truncate text-sm font-medium">
                        {page.page_title}
                      </div>
                      {page.page_description && (
                        <div className="max-w-xs truncate text-xs text-muted-foreground mt-1">
                          {page.page_description}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="outline" 
                        className={PageSEOService.getPageTypeColor(page.page_type)}
                      >
                        {PageSEOService.getPageTypeLabel(page.page_type)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={page.is_indexed ? "default" : "secondary"}>
                        {page.is_indexed ? "Indexed" : "No Index"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={page.is_indexed}
                        onCheckedChange={(checked) => handleToggleIndexing(page.id, page.is_indexed)}
                        disabled={isUpdating === page.id || page.page_type === 'admin'}
                      />
                      {page.page_type === 'admin' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Admin pages are always no-index
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pages found matching your search criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PageIndexingTable;