import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

import { IJob } from "@/interfaces/job.interface";
import { JobStatus } from "@/enums/jobstatus.enum";

interface JobStoreState {
  isLoading: boolean;
  isLoadingSingle: boolean;
  jobs: IJob[];
  wsConnected: boolean;
  reconnectAttempts: number;
  ws?: WebSocket;

  getAllJobs: () => Promise<void>;
  createJob: () => Promise<void>;
  getJobById: (jobId: number) => Promise<IJob | undefined>;
  updateJob: (updatedJob: IJob) => void;
  connectWebSocket: () => void;
  reconnectWebSocket: () => void;
}

export const useJobStore = create<JobStoreState>((set, get) => ({
  isLoading: false,
  isLoadingSingle: false,
  jobs: [],
  wsConnected: false,
  reconnectAttempts: 0,

  //GET ALL
  getAllJobs: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs`
      );
      const jobs: IJob[] = response.data;
      set({ jobs });
    } catch {
      toast.error("Error fetching jobs");
    } finally {
      set({ isLoading: false });
    }
  },

  //GET BY ID
  getJobById: async (jobId: number) => {
    set({ isLoadingSingle: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs/${jobId}`
      );
      const updatedJob: IJob = response.data;

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId ? { ...job, ...updatedJob } : job
        ),
      }));
      return response.data as IJob;
    } catch {
      toast.error("Error fetching jobs");
    } finally {
      set({ isLoadingSingle: false });
    }
  },

  //CREATE
  createJob: async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs`
      );
      const { jobId } = response.data;
      await get().getAllJobs();
      toast.success(`Created job with ID: ${jobId}`);
    } catch {
      toast.error("Error creating job");
    }
  },

  //UPDATE
  updateJob: (updatedJob: IJob) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === updatedJob.id ? { ...job, ...updatedJob } : job
      ),
    }));
  },

  //SOCKET
  connectWebSocket: () => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      set({ wsConnected: true, reconnectAttempts: 0 });
      get().getAllJobs();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.jobId) {
        get().updateJob({
          id: data.jobId,
          result: data.result,
          status: data.status as JobStatus,
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      set({ wsConnected: false });
      get().reconnectWebSocket();
    };

    set({ ws });
  },

  reconnectWebSocket: () => {
    const { reconnectAttempts } = get();
    if (reconnectAttempts < 5) {
      const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
      setTimeout(() => {
        set({ reconnectAttempts: reconnectAttempts + 1 });
        get().connectWebSocket();
      }, delay);
    } else {
      toast.error("Max reconnection attempts reached");
      console.error("Max reconnection attempts reached");
    }
  },
}));
