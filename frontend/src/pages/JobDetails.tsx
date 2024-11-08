import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { IJob } from "../interfaces/job.interface";
import { useJobStore } from "../state/useJobStore";
import { JobCard } from "@/components/JobCard";

export function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById } = useJobStore();
  const [job, setJob] = useState<IJob | null>(null);

  useEffect(() => {
    const getJobDetails = async () => {
      if (jobId) {
        const jobDetails = await getJobById(Number(jobId));
        setJob(jobDetails);
      }
    };
    getJobDetails();
  }, [jobId, getJobById]);

  if (!job) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w- bg-white rounded-lg">
        <JobCard job={job} />
      </div>
    </div>
  );
}
