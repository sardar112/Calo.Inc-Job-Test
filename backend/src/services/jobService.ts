import axios from "axios";

import { readJobsFromFile, updateJob } from "../utils/fileHandler";
import { notifyJobCompletion } from "../utils/websocket";
import { IJob } from "../interfaces/job.interface";
import { JobStatus } from "../enums/jobstatus.enum";

export const createJob = async (): Promise<string> => {
  const jobs = (await readJobsFromFile()) as IJob[];
  const newJob: IJob = {
    id: Date.now().toString(),
    status: JobStatus.PENDING,
  };
  jobs.push(newJob);
  updateJob(newJob.id, newJob);
  processJob(newJob.id);
  return newJob.id;
};

export const getJobs = async (): Promise<IJob[]> => readJobsFromFile();

export const getJobById = async (id: string): Promise<IJob | undefined> => {
  const jobs = (await readJobsFromFile()) as IJob[];
  return jobs.find((job) => job.id === id);
};

const processJob = async (jobId: string): Promise<void> => {
  const delay = Math.floor(Math.random() * 12) * 5000 + 5000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  try {
    console.log();
    const response = await axios.get(`${process.env.UNSPLASH_URL}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: "food",
      },
    });
    const imageUrl = response.data.urls.regular;

    const updatedJob = {
      status: JobStatus.RESOLVED,
      result: imageUrl,
    };
    updateJob(jobId, updatedJob);

    notifyJobCompletion(jobId, imageUrl);
  } catch (error) {
    console.error("Error fetching image", error);

    updateJob(jobId, { status: JobStatus.PENDING });
  }
};
