import {
  getAllInterviewReports,
  createInterviewReport,
  getInterviewReportById
} from "../../auth/services/interview.api.js";
import {useContext} from "react"
import { InterviewContext } from "../pages/interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setLoading, interviewReport, setInterviewReport, reports, setReports} = context;
    const createReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  setLoading(true);

  try {
    const response = await createInterviewReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    setInterviewReport(response.interviewReport);
return response.interviewReport;
  } finally {
    setLoading(false);
  }
};
  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setInterviewReport(response.interviewReport);
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, interviewReport, setInterviewReport, reports, setReports, createReport, getReportById, getAllReports }; 
};