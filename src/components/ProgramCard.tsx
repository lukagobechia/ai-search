
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Clock, DollarSign, Calendar, Users, Star } from 'lucide-react';
import { ProgramCard as ProgramCardType } from '../types/exchangeProgram';

interface ProgramCardProps {
  program: ProgramCardType;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const handleLearnMore = () => {
    window.open(program.programUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
            {program.programName}
          </CardTitle>
          {program.matchScore && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 fill-current" />
              {Math.round(program.matchScore)}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-blue-600 font-semibold">
            <Users className="w-4 h-4 mr-2" />
            {program.institution}
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {program.location}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-purple-500" />
              <span className="font-medium">Duration:</span>
            </div>
            <span className="text-gray-800">{program.duration}</span>
            
            {program.cost && (
              <>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">Cost:</span>
                </div>
                <span className="text-gray-800">{program.cost}</span>
              </>
            )}
            
            {program.applicationDeadline && (
              <>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  <span className="font-medium">Deadline:</span>
                </div>
                <span className="text-gray-800">{program.applicationDeadline}</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {program.description}
            </p>
          </div>

          {/* Highlights */}
          {program.highlights && program.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">Program Highlights:</h4>
              <div className="flex flex-wrap gap-1">
                {program.highlights.slice(0, 4).map((highlight, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
                  >
                    {highlight}
                  </Badge>
                ))}
                {program.highlights.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-600">
                    +{program.highlights.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {program.eligibility && (
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 text-sm">Eligibility:</h4>
              <p className="text-gray-600 text-sm">{program.eligibility}</p>
            </div>
          )}

          {/* Learn More Button */}
          <Button 
            onClick={handleLearnMore}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Learn More & Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
