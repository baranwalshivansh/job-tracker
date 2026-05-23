import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchJobs } from "../redux/jobSlice.js";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { jobTypes, locations } from "../utils/constants.js";

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    dispatch(fetchJobs(""));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesType = !type || job.jobType === type;
      const matchesLocation = !location || job.location === location;
      return matchesType && matchesLocation;
    });
  }, [jobs, type, location]);

  const handleSearch = (event) => {
    event.preventDefault();
    dispatch(fetchJobs(keyword));
  };

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink">Browse jobs</h1>
          <p className="mt-1 text-sm text-slate-600">Search openings and apply with your profile.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full gap-2 md:max-w-md">
          <input className="input" placeholder="Search title, skill, or company" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button className="btn-primary" type="submit">Search</button>
        </form>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All job types</option>
          {jobTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="input" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All locations</option>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <Loader /> : filteredJobs.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      ) : (
        <EmptyState title="No jobs found" message="Try a different keyword or clear your filters." />
      )}
    </section>
  );
};

export default Jobs;
