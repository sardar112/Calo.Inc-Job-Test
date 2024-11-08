import { useCallback, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { JobCard } from "../components/JobCard";
import { Button } from "../components/ui/button";

import { IJob } from "../interfaces/job.interface";
import { useJobStore } from "../state/useJobStore";

export function JobsDashboard() {
  const { isLoading, jobs, getAllJobs, createJob, connectWebSocket } =
    useJobStore();

  useEffect(() => {
    getAllJobs();
    connectWebSocket();
  }, [getAllJobs, connectWebSocket]);

  const handleCreateJob = useCallback(async () => {
    createJob();
  }, [createJob]);

  const handleRefreshJobs = useCallback(async () => {
    await getAllJobs();
    toast.success("Jobs refreshed successfully");
  }, [getAllJobs]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job List</h2>
        <div className="flex gap-2">
          <Button onClick={handleCreateJob}>Create New Job</Button>
          <Button onClick={handleRefreshJobs}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Jobs
          </Button>
        </div>
      </div>

      {isLoading && !jobs.length ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: IJob) => {
            return (
              <Link to={`/jobs/${job.id}`}>
                <JobCard key={job.id} job={job} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
