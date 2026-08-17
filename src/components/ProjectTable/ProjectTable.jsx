import React from "react";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import { 
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    flexRender, 
} from '@tanstack/react-table';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import data from '../../data/project_list.json';

const ProjectTable = ({ columnFilters, showForm, onShowForm }) => {
    const [expanded, setExpanded] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    // Filter method for project area and license checkboxes
    const checkboxFilter = (row, id, filterValue) => {
        if (filterValue.length === 0) {
            return true
        }
        
        let rowFilterValues = row.getValue(id) || [];
        if (typeof rowFilterValues === 'string') {
            rowFilterValues = rowFilterValues.split(", ");
        }
        return filterValue.some(filterVal => rowFilterValues.includes(filterVal))
    }

    const getInitials = (name) => {
        if (!name) return "";
        // Extract words keeping only alphabet letters, ignore empty chunks
        const words = name.trim().split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 0);
        
        if (words.length === 0) return "??";
        if (words.length === 1) {
            return words[0].length > 1 ? words[0].substring(0, 2).toUpperCase() : words[0].toUpperCase();
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    // Auto-resolve local logos from src/logos in Vite
    const localLogos = import.meta.glob('../../../src/logos/*.{webp,png,jpg,jpeg,svg}', { eager: true, query: '?url', import: 'default' });
    
    // Columns for React Table
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("projectName", {
            header: () => (
                <div className="flex justify-start items-center">
                    <div className="opacity-0 h-4 w-7 mr-2">
                        <ChevronRightIcon />
                    </div>
                    <div className="opacity-0 w-20 h-20 mr-4"></div>
                    <span>Name & Details</span>
                </div>
            ),
            cell: info => {
                let logo = info.row.original.logo;
                const projectName = info.getValue() || "";
                
                // If it's a local reference to src/logos, map it to the imported asset URL
                if (logo && logo.startsWith("src/logos/")) {
                    const filename = logo.split("/").pop();
                    const logoKey = Object.keys(localLogos).find(key => key.endsWith(filename));
                    if (logoKey) {
                        logo = localLogos[logoKey];
                    } else {
                        // fallback to base path
                        logo = import.meta.env.BASE_URL + logo;
                    }
                }
                
                return (
                    <div className="flex items-center py-2 w-full">
                        <button onClick={() => info.row.toggleExpanded()} className="flex items-center justify-center shrink-0 h-8 w-8 mr-2 text-gray-500 hover:text-gray-900 transition-colors">
                            {info.row.getIsExpanded() ? <ChevronDownIcon className="h-7 w-7" /> : <ChevronRightIcon className="h-7 w-7" />}
                        </button>
                        
                        <button 
                            onClick={() => info.row.toggleExpanded()} 
                            className={`flex items-center justify-center shrink-0 w-20 h-20 rounded-xl border mr-4 overflow-hidden shadow-sm hover:scale-105 transition-transform ${logo ? 'bg-transparent border-gray-200 p-1' : 'bg-gtgoldlight bg-opacity-20 border-gtgold/30 text-gtgolddark font-bold'}`}
                        >
                            {logo ? (
                                <img src={logo} alt={`${projectName} logo`} className="w-full h-full object-contain object-center" />
                            ) : (
                                <span className="text-2xl">{getInitials(projectName)}</span>
                            )}
                        </button>
                        
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                            <div className="flex items-center text-xl text-gtgolddark font-semibold">
                                <span className="truncate">{projectName}</span>
                            </div>
                            {info.row.original.projectAbstract && (
                                <div className="text-sm text-gray-600 mt-1 max-w-2xl line-clamp-2">
                                    {info.row.original.projectAbstract}
                                </div>
                            )}
                            {(info.row.original.projectUrl || info.row.original.guidelinesUrl) && (
                                <div className="text-xs flex-wrap gap-y-2 text-blue-600 mt-2 flex space-x-4">
                                    {info.row.original.projectUrl && <a href={info.row.original.projectUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center shrink-0">Project Site</a>}
                                    {info.row.original.guidelinesUrl && <a href={info.row.original.guidelinesUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center shrink-0">Guidelines</a>}
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor("projectAreas", {
            id: "projectAreas",
            header: () => "Project Areas",
            filterFn: checkboxFilter,
            cell: info => (
                <div className="flex flex-wrap gap-1">
                    {(info.getValue() || []).map((area, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-md shadow-sm border border-indigo-200">{area}</span>
                    ))}
                </div>
            )
        }),
        columnHelper.accessor("licenses", {
            id: "licenses",
            header: () => "Licenses",
            filterFn: checkboxFilter,
            cell: info => (
                <div className="flex flex-wrap gap-1">
                    {(info.getValue() || []).map((license, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md shadow-sm border border-emerald-200">{license}</span>
                    ))}
                </div>
            )
        }),
    ];

    // const data = temp;
    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
            pagination,
            columnFilters,
        },
        onExpandedChange: setExpanded,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full flex flex-col">
            <div className="overflow-x-auto w-full border border-gray-200 shadow-sm rounded-lg bg-white">
                <table className="w-full min-w-[800px] border-collapse">
                    {/* Table headers */}
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="text-left text-lg font-semibold">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2 w-52">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Table rows */}
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <React.Fragment key={row.id}>
                                <tr className={`px-4 py-2 text-left ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-gray-100 transition-colors`}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-2 align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {/* Expanded row content */}
                                {row.getIsExpanded() && (
                                    <tr className={`px-4 py-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 shadow-inner`}>
                                        <td colSpan={columns.length} className="p-4">
                                            <div className="flex flex-col md:flex-row w-full gap-4">
                                                <div className="w-full md:w-5/12 md:border-r border-gray-200 overflow-auto max-h-64 md:pr-4">
                                                    <h3 className="text-center md:text-left mb-2 font-semibold">Abstract</h3>
                                                    <p className="text-sm md:text-base">{row.original.projectAbstract}</p>
                                                </div>
                                                <div className="w-full md:w-1/4 md:border-r border-gray-200 md:pr-4">
                                                    <h3 className="text-center md:text-left mb-2 font-semibold">Primary Contact(s)</h3>
                                                    <ul className="text-sm md:text-base">
                                                        {row.original.contacts.map((contact, index) => {
                                                            return (
                                                                <li key={index} className="mb-2 break-all">
                                                                    {index + 1}. {contact.name} {contact.email && `(${contact.email})`}
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>

                                                <div className="w-full md:w-1/3">
                                                    <h3 className="text-center md:text-left mb-2 font-semibold">URL(s)</h3>
                                                    <p className="font-medium text-sm md:text-base">Project URL: <a href={row.original.projectUrl} className="font-normal break-all text-blue-600 hover:underline">{row.original.projectUrl}</a></p>
                                                    {row.original.guidelinesUrl && (
                                                        <p className="font-medium text-sm md:text-base mt-2">Guidelines URL: <a href={row.original.guidelinesUrl} className="font-normal break-all text-blue-600 hover:underline">{row.original.guidelinesUrl}</a></p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}

                {/* Empty rows if needed */}
                        {Array.from({ length: pagination.pageSize - table.getRowModel().rows.length }, (_, index) => (
                            <tr key={`padding-${index}`} className={`px-4 py-2 ${((table.getRowModel().rows.length + index) % 2) === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                <td colSpan={columns.length} className="px-4 py-2">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 px-4 w-full">
                {/* Button to add new project */}
                <div className="w-full md:w-auto md:mr-10 flex justify-center">
                    <button 
                        onClick={onShowForm}
                        className={`block w-[180px] rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm bg-gtgold text-white hover:bg-gtgoldlight`}
                    >
                        {showForm ? "Close Form" : "Submit New Project"}
                    </button>
                </div>

                <div className="w-full md:w-auto flex justify-center overflow-x-auto">
                    <Pagination
                        pageIndex={table.getState().pagination.pageIndex}
                        pageCount={table.getPageCount()}
                        pageSize={table.getState().pagination.pageSize}
                        onChangePageSize={(pageSize) => table.setPageSize(pageSize)}
                        onChangeFirstPage={() => table.setPageIndex(0)}
                        onChangeNextPage={() => table.nextPage()}
                        onChangePreviousPage={() => table.previousPage()}
                        onChangePageIndex={(pageIndex) => table.setPageIndex(pageIndex)}
                        canNextPage={table.getCanNextPage()}
                        canPreviousPage={table.getCanPreviousPage()}
                    />
                </div>
            </div>
        </div>
    )
};

export default ProjectTable;