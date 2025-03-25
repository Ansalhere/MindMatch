
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  X, 
  Trophy,
  Briefcase,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown } from 'lucide-react';

interface ApplicantsListProps {
  applicants: any[];
  isEmployer?: boolean;
  realJobs?: any[];
  totalApplications?: number;
  loadingJobs?: boolean;
}

const ApplicationsList = ({ 
  applicants, 
  isEmployer = true, 
  realJobs = [], 
  totalApplications = 0,
  loadingJobs = false
}: ApplicantsListProps) => {
  const [rankFilter, setRankFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("highest");

  const filteredApplicants = applicants.filter(applicant => {
    if (rankFilter === "all") return true;
    if (rankFilter === "top50" && applicant.ranking.position <= 50) return true;
    if (rankFilter === "top100" && applicant.ranking.position <= 100) return true;
    if (rankFilter === "top500" && applicant.ranking.position <= 500) return true;
    return false;
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortOrder === "highest") {
      return a.ranking.position - b.ranking.position;
    } else {
      return b.ranking.position - a.ranking.position;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 space-x-2">
        <div className="flex items-center space-x-2">
          <Select value={rankFilter} onValueChange={setRankFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranks</SelectItem>
              <SelectItem value="top50">Top 50</SelectItem>
              <SelectItem value="top100">Top 100</SelectItem>
              <SelectItem value="top500">Top 500</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by Rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest">Highest Rank First</SelectItem>
              <SelectItem value="lowest">Lowest Rank First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="ml-auto">
          {realJobs.length > 0 ? totalApplications : filteredApplicants.length} candidates
        </Badge>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="text-center">{realJobs.length > 0 ? "Status" : "Match"}</TableHead>
            <TableHead className="text-center">Ranking</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="font-medium">{applicant.name}</TableCell>
              <TableCell>{applicant.position}</TableCell>
              <TableCell className="text-center">
                <Badge className={`${
                  applicant.matchScore >= 95 ? 'bg-green-100 text-green-800' : 
                  applicant.matchScore >= 85 ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {applicant.matchScore}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-amber-500">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="font-semibold">#{applicant.ranking.position}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Top {Math.round((applicant.ranking.position / applicant.ranking.total) * 100)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Shortlist
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsList;
