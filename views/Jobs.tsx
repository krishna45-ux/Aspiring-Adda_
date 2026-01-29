import React, { useMemo } from 'react';
import { Search, X, Heart, ExternalLink, MapPin, Building2, Briefcase, Filter } from 'lucide-react';
import { useApp } from '../AppContext';
import { AVAILABLE_SKILLS, SPECIALIZATIONS } from '../constants';
import { Job } from '../types';
import Button from '../components/Button';

const LOCATIONS = ["Bangalore", "Remote", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Noida", "Chennai"];

const Jobs: React.FC = () => {
  const {
    view,
    searchTerm, setSearchTerm,
    jobFilter, setJobFilter,
    locationFilter, setLocationFilter,
    userSkills, toggleUserSkill,
    savedJobs, toggleSaveJob,
    isDark
  } = useApp();

  const isSavedView = view === 'saved';

  // --- DATA GENERATION (Unchanged Logic) ---
  const allJobs: Job[] = useMemo(() => {
    const jobs: Job[] = [];
    const bgs = ["bg-blue-500", "bg-emerald-500", "bg-black", "bg-rose-500", "bg-purple-500", "bg-orange-500"];

    SPECIALIZATIONS.forEach((spec) => {
        const companies = ["Google", "Microsoft", "Amazon", "Tesla", "Adobe", "Salesforce", "Atlassian", "Uber", "Flipkart", "Swiggy", "Zomato", "Paytm"];

        let extraSkills: string[] = [];
        if (spec.id === 's1') extraSkills = ["React", "Node.js", "AWS"];
        else if (spec.id === 's2') extraSkills = ["Python", "Data", "AWS"];
        else if (spec.id === 's3') extraSkills = ["AWS", "Python"];
        else if (spec.id === 's4') extraSkills = ["Mobile", "React"];
        else if (spec.id === 's12') extraSkills = ["Security", "Python"];
        else if (spec.id === 's13') extraSkills = ["Gaming", "Design"];
        else if (spec.id === 's5') extraSkills = ["Management", "Data"];
        else if (spec.id === 's6') extraSkills = ["Marketing", "Design"];
        else if (spec.id === 's7') extraSkills = ["Design"];
        else if (spec.id === 's14') extraSkills = ["Blockchain", "Security"];
        else if (spec.id === 's15') extraSkills = ["Finance", "Data"];
        else if (spec.id === 's16') extraSkills = ["HR", "Management"];

        for (let i = 0; i < 12; i++) {
            const company = companies[(i + parseInt(spec.id.replace(/\D/g, ''))) % companies.length];
            const isStartup = i > 4;
            const bg = bgs[(i + parseInt(spec.id.replace(/\D/g, ''))) % bgs.length];

            if (extraSkills.length === 0) {
                extraSkills = [AVAILABLE_SKILLS[Math.floor(Math.random() * AVAILABLE_SKILLS.length)]];
            }

            jobs.push({
                id: `job_${spec.id}_${i}`,
                title: spec.name,
                company,
                loc: LOCATIONS[i % LOCATIONS.length],
                sal: spec.salary,
                experience: ["Fresher (0-2y)", "Mid-Level (2-5y)", "Senior (5y+)"][i % 3],
                tags: [isStartup ? "Startup" : "MNC", ...spec.tags, ...extraSkills],
                bg,
                logoUrl: `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`,
                url: "#"
            });
        }
    });
    return jobs;
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(j => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = j.title.toLowerCase().includes(term) ||
                              j.company.toLowerCase().includes(term) ||
                              j.loc.toLowerCase().includes(term);
        const matchesExperience = jobFilter === 'All' || j.experience === jobFilter;
        const matchesLocation = locationFilter === 'All' || j.loc === locationFilter;
        const matchesSkills = userSkills.size === 0 || j.tags.some(t => userSkills.has(t));
        const baseMatch = matchesSearch && matchesExperience && matchesLocation && matchesSkills;
        if (isSavedView) return savedJobs.has(j.id) && baseMatch;
        return baseMatch;
    });
  }, [allJobs, searchTerm, jobFilter, locationFilter, userSkills, savedJobs, isSavedView]);

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* --- HEADER SECTION --- */}
        <div className="mb-6 md:mb-10">
          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase font-brutal dark:font-sans leading-[0.9] mb-2">
            {isSavedView ? 'Saved Gigs' : 'Job Board'}
          </h2>
          <p className="text-sm md:text-lg font-bold text-zinc-500 dark:text-gray-400">
            {isSavedView ? 'Your curated collection.' : 'Hunt or be hunted.'}
          </p>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col gap-5 mb-8">
            {/* Search Bar */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search roles, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 md:py-4 bg-white border-2 border-black rounded-xl font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all dark:bg-black/50 dark:border-white/20 dark:text-white dark:shadow-none text-sm md:text-base"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-white" />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-full dark:hover:bg-white/10"
                    >
                        <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                )}
            </div>

            {/* Filter Scrollers Container - No overflow on main page */}
            {!isSavedView && (
                <div className="flex flex-col gap-4">
                    {/* Skills Row */}
                    <div>
                         <div className="flex items-center gap-2 mb-2 px-1">
                            <Filter className="w-3 h-3 text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Skills</span>
                         </div>
                         <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar snap-x">
                            {AVAILABLE_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleUserSkill(skill)}
                                    className={`snap-start shrink-0 px-3 py-1.5 border-2 font-bold uppercase text-[10px] md:text-xs rounded-lg transition-all ${userSkills.has(skill)
                                        ? 'bg-black text-white border-black dark:bg-nebula-gold dark:text-black dark:border-nebula-gold'
                                        : 'bg-white text-black border-black dark:bg-transparent dark:text-gray-400 dark:border-white/20'}`}
                                >
                                    {skill}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Exp & Loc Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Experience */}
                        <div className="overflow-hidden">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Level</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar">
                                {['All', 'Fresher (0-2y)', 'Mid-Level (2-5y)', 'Senior (5y+)'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setJobFilter(f)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold border-2 whitespace-nowrap transition-all ${jobFilter === f
                                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                            : 'bg-white text-zinc-600 border-black dark:bg-transparent dark:text-zinc-500 dark:border-zinc-700'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Location */}
                        <div className="overflow-hidden">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Zone</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 no-scrollbar">
                                {['All', ...LOCATIONS].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLocationFilter(l)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold border-2 whitespace-nowrap transition-all ${locationFilter === l
                                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                            : 'bg-white text-zinc-600 border-black dark:bg-transparent dark:text-zinc-500 dark:border-zinc-700'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {(userSkills.size > 0 || jobFilter !== 'All' || locationFilter !== 'All') && (
                        <button
                            onClick={() => { setJobFilter('All'); setLocationFilter('All'); toggleUserSkill(''); }}
                            className="self-start text-xs font-bold text-red-500 hover:underline px-1"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* --- JOB LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
            {filteredJobs.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-black rounded-2xl bg-white/50 dark:border-white/10 dark:bg-white/5">
                    <p className="font-bold text-zinc-500 dark:text-gray-400">No active signals found.</p>
                </div>
            )}

            {filteredJobs.map((job) => (
                <div
                    key={job.id}
                    className="card-base p-4 flex flex-col gap-3 relative group bg-white dark:bg-white/5 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:!shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:!shadow-none dark:hover:bg-white/10"
                >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Logo */}
                            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 border-2 border-black bg-white flex items-center justify-center rounded-lg overflow-hidden dark:bg-black dark:border-white/10 relative">
                                <span className="font-black text-lg text-black dark:text-white z-0">{job.company[0]}</span>
                                <img
                                    src={job.logoUrl}
                                    alt={job.company}
                                    className="absolute inset-0 w-full h-full object-contain bg-white p-1 dark:bg-black z-10 transition-opacity duration-300"
                                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                                />
                            </div>

                            {/* Title Info */}
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm md:text-lg font-black uppercase text-black dark:text-white truncate font-brutal dark:font-sans leading-tight">
                                    {job.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-500 dark:text-zinc-400 truncate">
                                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.company}</span>
                                    <span className="hidden md:flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                            className={`shrink-0 p-2 rounded-lg border-2 border-black transition-colors dark:border-white/10 ${savedJobs.has(job.id) ? 'bg-red-50 text-red-500 border-red-500 dark:bg-red-900/20 dark:border-red-500' : 'bg-white text-zinc-300 hover:text-black dark:bg-transparent dark:text-zinc-600 dark:hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Meta Tags (Mobile Only: Location shown here if space tight above) */}
                    <div className="flex md:hidden items-center gap-3 text-[10px] font-bold text-zinc-500 border-b-2 border-black/5 pb-2 dark:border-white/5 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.experience}</span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {job.tags.slice(0, 4).map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase border border-black bg-zinc-100 rounded text-black dark:bg-white/5 dark:border-white/20 dark:text-zinc-300">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-2">
                        <a
                            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}&location=${encodeURIComponent(job.loc)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 bg-blue-600 text-white font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all text-xs md:text-sm uppercase tracking-wider dark:border-none dark:shadow-none"
                        >
                            Apply Now <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Jobs;