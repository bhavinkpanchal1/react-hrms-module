import { Button } from "@/shared/ui";
import { useCandidate } from "../../hooks/useCandidates";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useParams } from "react-router-dom";

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const candidateId = Number(id);
  const { data: candidate, isLoading, error } = useCandidate(candidateId);

    if (isLoading) {
    return <div>Loading...</div>;
    }

    if (error || !candidate) {
    return <div>Candidate not found</div>;
  }

  return (
    <>
    {console.log(candidate)}
      <div className="my-5 flex h-8 items-center justify-between px-4 sm:px-5">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Candaite Details Page
          </h2>
          <div className="hidden h-full py-1 sm:flex">
            <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
          </div>
          <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
            <li className="flex items-center space-x-2">
              <a
                className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                href="/employees"
              >
                 Candaite Details
              </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </li>
            <li>Listview</li>
          </ul>
        </div>
      </div>

      {/* Filter section & Export dropdown */}
      <div className="card p-4">
        <div>
          <div className="flex items-end justify-between">
            <input
              id="filter-input"
              type="search"
              placeholder="Filter..."
              className="mb-4 p-2 border border-slate-300 rounded form-control focus:border-primary outline-none w-full lg:w-36"
            />
            <div className="flex items-end justify-end mb-4 flex-wrap ">
              <div id="dropdown-wrapper6" className="inline-flex">
                <button className="popper-ref btn space-x-2 bg-slate-150 ml-3 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90 [&amp;.is-active_svg]:rotate-180">
                  <span>Export</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800">
          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-50">
                Personal Information
              </h3>

              <Button variant="ghost" size="md">
                <Pencil className="size-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
              {/* Left Section */}
              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Avatar */}
                <div className="flex justify-center sm:block">
                  <img
                    //src={candidate.avatar || "/images/avatar-placeholder.png"}
                    //alt={candidate.fullName}
                    className="h-28 w-28 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-navy-700"
                  />
                </div>

                {/* Candidate Info */}
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-navy-50">
                   {candidate.first_name} {candidate.last_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
                    IT
                  </p>

                  <p className="text-sm text-slate-500 dark:text-navy-300">
                   {candidate.job_title}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Employee ID: {candidate.id}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-navy-700 dark:text-navy-100">
                      Joined: {candidate.applied_at}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[380px]">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-navy-300">
                    Phone
                  </p>

                  <a
                    href="tel:+18006427676"
                    className="mt-1 block font-medium text-slate-700 hover:text-primary dark:text-navy-50"
                  >
                    {candidate.phone}
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-navy-300">
                    Email
                  </p>

                  <a
                    href="mailto:ethanmitchell@example.com"
                    className="mt-1 block font-medium text-slate-700 hover:text-primary dark:text-navy-50"
                  >
                    {candidate.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-navy-300">
                    Birthday
                  </p>

                  <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
                    28 December 1992
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-navy-300">
                    Gender
                  </p>

                  <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
                    Male
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-navy-300">
                    Address
                  </p>

                  <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
                    100 Terminal, Fort Lauderdale, Miami 33315, United States
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CandidateDetailsPage;
