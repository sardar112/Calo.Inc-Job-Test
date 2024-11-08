import fs from "fs";
import fsExt from "fs-ext";
import path from "path";
import { IJob } from "../interfaces/job.interface";

const filePath = path.join(__dirname, "./../data/jobs.json");
let writeQueue: { jobId: string; updatedJob: Partial<IJob> }[] = [];
let isProcessing = false;

const initializeFile = () => {
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Directory created:", dirPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
};

const lockFile = (fd: number, lockType: "ex" | "sh") => {
  return new Promise((resolve, reject) => {
    fsExt.flock(fd, lockType, (err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

const unlockFile = (fd: number) => {
  return new Promise((resolve, reject) => {
    fsExt.flock(fd, "un", (err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

export const readJobsFromFile = async (): Promise<any[]> => {
  initializeFile();
  const fd = fs.openSync(filePath, "r+");

  let data = [];
  try {
    await lockFile(fd, "sh");
    const fileData = fs.readFileSync(fd, "utf-8");
    data = JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading file", error);
  } finally {
    await unlockFile(fd);
  }
  return data;
};

const writeJobsToFile = async (jobs: Partial<IJob>[]) => {
  const fd = fs.openSync(filePath, "w");
  try {
    await lockFile(fd, "ex");
    fs.writeFileSync(fd, JSON.stringify(jobs, null, 2));
  } catch (error) {
    console.error("Error writing to file", error);
  } finally {
    await unlockFile(fd);
    fs.closeSync(fd);
  }
};

const processNextWrite = async () => {
  if (writeQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { jobId, updatedJob } = writeQueue.shift()!;

  try {
    const jobs = await readJobsFromFile();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob };
    } else {
      jobs.push({
        id: jobId,
        ...updatedJob,
      });
    }
    await writeJobsToFile(jobs);
  } catch (error) {
    console.error("Error processing write queue", error);
  } finally {
    processNextWrite();
  }
};

export const updateJob = (jobId: string, updatedJob: any): void => {
  writeQueue.push({ jobId, updatedJob });

  if (!isProcessing) {
    processNextWrite();
  }
};

export const addJob = (newJob: any): void => {
  writeQueue.push({ jobId: newJob.id, updatedJob: newJob });

  if (!isProcessing) {
    processNextWrite();
  }
};
