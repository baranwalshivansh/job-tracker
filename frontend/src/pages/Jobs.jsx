import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { fetchJobs } from "../redux/jobSlice.js";
import JobCard from "../components/JobCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { JobGridSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useSavedJobs from "../hooks/useSavedJobs.js";
import usePagination from "../hooks/usePagination.js";
import { jobTypes, locations, salaryRanges, experienceLevels } from "../utils/constants.js";
import { cn } from "../utils/cn.js";

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { isSaved, toggleSave, savedIds } = useSavedJobs();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(""));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredJobs = useMemo(() => {
    const range = salaryRanges[salaryRange];
    return jobs.filter((job) => {
      const salary = Number(job.salary || 0);
      const matchesType = !type || job.jobType === type;
      const matchesLocation = !location || job.location === location;
      const matchesExp = !experience || String(job.experienceLevel) === experience;
      const matchesSalary = salary >= range.min && salary <= range.max;
      const matchesSaved = !savedOnly || savedIds.includes(job._id);
      return matchesType && matchesLocation && matchesExp && matchesSalary && matchesSaved;
    });
  }, [jobs, type, location, experience, salaryRange, savedOnly, savedIds]);

  const { paginatedItems, page, totalPages, goToPage, resetPage } = usePagination(filteredJobs, 9);

  useEffect(() => {
    resetPage();
  }, [type, location, experience, salaryRange, savedOnly, resetPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    dispatch(fetchJobs(keyword));
    resetPage();
  };

  const clearFilters = () => {
    setType("");
    setLocation("");
    setExperience("");
    setSalaryRange(0);
    setSavedOnly(false);
    resetPage();
  };

  const hasFilters = type || location || experience || salaryRange > 0 || savedOnly;

  return (
    <div>
      <PageHeader
        title="Browse jobs"
        subtitle={`${filteredJobs.length} roles match your filters`}
        actions={
          <button
            type="button"
            className="btn-secondary lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        }
      />

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            className="input pl-10"
            placeholder="Search title, skill, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button className="btn-primary shrink-0" type="submit">
          Search
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className={cn("space-y-4", !showFilters && "hidden lg:block")}>
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">Job type</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">All types</option>
                  {jobTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">Location</label>
                <select className="input" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">All locations</option>
                  {locations.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">Experience</label>
                <select className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
                  <option value="">Any experience</option>
                  {experienceLevels.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">Salary</label>
                <select className="input" value={salaryRange} onChange={(e) => setSalaryRange(Number(e.target.value))}>
                  {salaryRanges.map((item, i) => (
                    <option key={item.label} value={i}>{item.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} className="rounded border-slate-300" />
                Saved only
              </label>
              {hasFilters && (
                <button type="button" className="btn-ghost w-full text-sm" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <JobGridSkeleton />
          ) : paginatedItems.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedItems.map((job, i) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    index={i}
                    saved={isSaved(job._id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="btn-secondary !min-h-9"
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="px-3 text-sm text-ink-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary !min-h-9"
                    disabled={page === totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No jobs found"
              message="Try adjusting filters or search with a different keyword."
              action={
                hasFilters ? (
                  <button type="button" className="btn-primary" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
