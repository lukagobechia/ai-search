
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchForm from '../components/SearchForm';
import ProgramCard from '../components/ProgramCard';
import { exchangeProgramApi } from '../services/exchangeProgramApi';
import { ExchangeProgramQuery, ExchangeProgramResponse } from '../types/exchangeProgram';
import { toast } from 'sonner';
import { Search, Globe, BookOpen, Award } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PROGRAMS_PER_PAGE = 9;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<ExchangeProgramQuery | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['exchange-programs', searchQuery],
    queryFn: () => exchangeProgramApi.searchPrograms(searchQuery!),
    enabled: !!searchQuery,
    retry: false,
  });

  const handleSearch = (query: ExchangeProgramQuery) => {
    console.log('Searching with query:', query);
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  React.useEffect(() => {
    if (error) {
      toast.error('Failed to search programs. Please try again.');
      console.error('Search error:', error);
    }
  }, [error]);

  React.useEffect(() => {
    if (data && data.success) {
      toast.success(`Found ${data.totalFound} exchange programs!`);
    } else if (data && !data.success) {
      toast.error(data.error || 'Search failed');
    }
  }, [data]);

  // Pagination logic
  const allPrograms = data?.programs || [];
  const totalPages = Math.ceil(allPrograms.length / PROGRAMS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROGRAMS_PER_PAGE;
  const endIndex = startIndex + PROGRAMS_PER_PAGE;
  const currentPrograms = allPrograms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="start">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="end">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Your Global Education Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find the perfect exchange program from universities worldwide
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe className="w-8 h-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">250+</div>
                <div className="text-blue-200">Partner Universities</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-8 h-8 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-blue-200">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-12">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Results Section */}
      {data && (
        <div className="container mx-auto px-4 pb-12">
          {data.success && data.programs && data.programs.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Search Results
                  </h2>
                  <div className="text-gray-600">
                    Found {data.totalFound} programs • Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>

              {/* Programs Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {currentPrograms.map((program, index) => (
                  <ProgramCard key={`${program.programUrl}-${startIndex + index}`} program={program} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : data.success && data.programs && data.programs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No programs found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or using different keywords
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Search Error
              </h3>
              <p className="text-gray-500 mb-6">
                {data.error || 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State - No Search Yet */}
      {!searchQuery && (
        <div className="container mx-auto px-4 pb-12">
          <div className="text-center py-16">
            <div className="text-gray-300 mb-6">
              <Globe className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Ready to Find Your Perfect Exchange Program?
            </h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Use the search form above to discover amazing exchange opportunities from universities around the world. 
              Filter by country, education level, program type, and field of study to find your ideal match.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
