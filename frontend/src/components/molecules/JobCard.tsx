import { IJob } from "@/interfaces/job.interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../atom/card";
import { Badge } from "../atom/badge";
import { Loader2 } from "lucide-react";
import { JobStatus } from "@/enums/jobstatus.enum";

export interface IJobCardProps {
  job: IJob;
  isDetail: boolean;
}

export function JobCard({ job, isDetail }: IJobCardProps) {
  return (
    <Card key={job.id}>
      <CardHeader className="justify-self-start">
        <CardTitle>Job {job.id}</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Badge
            variant={job.status === JobStatus.PENDING ? "outline" : "default"}
          >
            {job.status}
          </Badge>
        </div>
        {job.status === JobStatus.RESOLVED && job.result && (
          <img
            src={job.result}
            alt="Job result"
            className={`mt-2 w-full ${
              isDetail ? "h-[30rem]" : "h-[15rem]"
            } object-cover rounded`}
          />
        )}
      </CardContent>
      <CardFooter>
        {job.status === JobStatus.PENDING && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
