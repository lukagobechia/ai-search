
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, GraduationCap, Calendar, BookOpen, X, DollarSign } from 'lucide-react';
import { ExchangeProgramQuery } from '../types/exchangeProgram';
import SearchProgressIndicator from './SearchProgressIndicator';
import { socketService } from '../services/socketService';

interface SearchFormProps {
  onSearch: (query: ExchangeProgramQuery) => void;
  isLoading: boolean;
}

const COUNTRIES = [
  'Australia', 'Canada', 'United Kingdom', 'United States', 'Germany', 
  'France', 'Netherlands', 'Sweden', 'Denmark', 'Japan', 'South Korea', 
  'Singapore', 'New Zealand', 'Switzerland', 'Italy', 'Spain'
];

const FIELDS_OF_STUDY = [
  'Business Administration', 'Computer Science', 'Engineering', 'Medicine',
  'Psychology', 'International Relations', 'Economics', 'Art & Design',
  'Environmental Science', 'Literature', 'Mathematics', 'Physics',
  'Chemistry', 'Biology', 'History', 'Philosophy'
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CAD', label: 'CAD (C$)' },
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [freeTextQuery, setFreeTextQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<string>('');
  const [programType, setProgramType] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [budgetRange, setBudgetRange] = useState([0, 50000]);
  const [budgetCurrency, setBudgetCurrency] = useState('USD');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [searchProgress, setSearchProgress] = useState<{
    currentStep: 'general' | 'education_sites' | 'program_specific' | 'extracting_programs' | 'ranking_programs' | null;
    isComplete: boolean;
  }>({
    currentStep: null,
    isComplete: false,
  });

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    const socket = socketService.connect();
    
    if (socket) {
      socket.on('search-progress', (data: { stage: string }) => {
        console.log('Search progress update:', data.stage);
        setSearchProgress({
          currentStep: data.stage as 'general' | 'education_sites' | 'program_specific' | 'extracting_programs' | 'ranking_programs',
          isComplete: false,
        });
      });

      socket.on('search-complete', () => {
        // Mark all steps as complete first
        setSearchProgress({
          currentStep: 'ranking_programs',
          isComplete: true,
        });
        
        // Hide progress indicator after 3 seconds
        setTimeout(() => {
          setSearchProgress({
            currentStep: null,
            isComplete: false,
          });
        }, 3000);
      });
    }

    return () => {
      if (socket) {
        socket.off('search-progress');
        socket.off('search-complete');
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const query: ExchangeProgramQuery = {
      freeTextQuery: freeTextQuery.trim() || undefined,
      preferredCountries: selectedCountries.length > 0 ? selectedCountries : undefined,
      educationLevel: educationLevel as any || undefined,
      programType: programType as any || undefined,
      fieldOfStudy: fieldOfStudy || undefined,
      budgetRange: budgetRange[0] > 0 || budgetRange[1] < 50000 ? {
        min: budgetRange[0],
        max: budgetRange[1],
        currency: budgetCurrency
      } : undefined,
    };

    // Start countdown
    setCountdown(4);
    
    // Execute search after 2 seconds
    setTimeout(() => {
      // Reset progress state
      setSearchProgress({
        currentStep: 'general',
        isComplete: false,
      });
      
      // Add clientId to query for WebSocket identification
      const socket = socketService.getSocket();
      const queryWithClientId = {
        ...query,
        clientId: socket?.id
      };
      
      onSearch(queryWithClientId);
    }, 2000);
  };

  const addCountry = (country: string) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  };

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budgetCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isSearching = isLoading || countdown !== null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6" />
            Find Your Perfect Exchange Program
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Free Text Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Programs
              </Label>
              <Input
                id="search"
                placeholder="e.g., business program in Australia, engineering exchange..."
                value={freeTextQuery}
                onChange={(e) => setFreeTextQuery(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Countries */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Preferred Countries
                </Label>
                <Select onValueChange={addCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCountries.map((country) => (
                    <Badge key={country} variant="secondary" className="flex items-center gap-1">
                      {country}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeCountry(country)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education Level
                </Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="any">Any Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Program Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Program Type
                </Label>
                <Select value={programType} onValueChange={setProgramType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="year">Full Year</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field of Study */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Field of Study
                </Label>
                <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELDS_OF_STUDY.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Range
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Currency</Label>
                  <Select value={budgetCurrency} onValueChange={setBudgetCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    Range: {formatBudget(budgetRange[0])} - {formatBudget(budgetRange[1])}
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatBudget(0)}</span>
                <span>{formatBudget(50000)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              disabled={isSearching}
            >
              {countdown !== null ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching in {countdown}...
                </div>
              ) : isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Programs
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <SearchProgressIndicator 
        currentStep={searchProgress.currentStep}
        isComplete={searchProgress.isComplete}
      />
    </div>
  );
};

export default SearchForm;
