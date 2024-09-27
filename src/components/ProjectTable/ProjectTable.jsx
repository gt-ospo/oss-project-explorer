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
        
        const rowFilterValues = row.getValue(id).split(", ")
        return filterValue.some(filterVal => rowFilterValues.includes(filterVal))
    }

    // Columns for React Table
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("projectName", {
            header: () => (
                <div className="flex justify-start items-center">
                    <div className="opacity-0 h-4 w-7">
                        <ChevronRightIcon />
                    </div>
                    <span>Name</span>
                </div>
            ),
            cell: info => (
                <div className="flex items-center">
                    <button onClick={() => info.row.toggleExpanded()} className="flex items-center justify-center h-5 w-5">
                        {info.row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                    </button>
                    <span className="ml-2">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor(row => row.projectAreas.join(", "), {
            id: "projectAreas",
            header: () => "Project Areas",
            filterFn: checkboxFilter
        }),
        columnHelper.accessor(row => row.licenses.join(", "), {
            id: "licenses",
            header: () => "Licenses",
            filterFn: checkboxFilter
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
        <div>
            <div className="px-6 lg:px-8 overflow-y-auto">
                <table className="w-full">
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
                                <tr className={`px-4 py-2 text-left ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {/* Expanded row content */}
                                {row.getIsExpanded() && (
                                    <tr className={`px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                        <td colSpan={columns.length}>
                                            <div className="flex w-full">
                                                <div className="w-5/12 border-r border-gray-400 overflow-auto max-h-64">
                                                    <h3 className="text-center mb-2 font-semibold">Abstract</h3>
                                                    <p>{row.original.projectAbstract}</p>
                                                </div>
                                                <div className="w-1/4 border-r border-gray-400">
                                                    <h3 className="text-center mb-2 font-semibold">Primary Contact(s)</h3>
                                                    <ul>
                                                        {row.original.contacts.map((contact, index) => {
                                                            return (
                                                                <li className="mb-2 break-all">
                                                                    {index + 1}. {contact.name} {contact.email && `(${contact.email})`}
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>

                                                <div className="w-1/3">
                                                    <h3 className="text-center mb-2 font-semibold">URL(s)</h3>
                                                    <p className="font-medium">Project URL: <a href={row.original.projectUrl} className="font-normal break-all">{row.original.projectUrl}</a></p>
                                                    {row.original.guidelinesUrl && (
                                                        <p className="font-medium">Guidelines URL: <a href={row.original.guidelinesUrl} className="font-normal break-all">{row.original.guidelinesUrl}</a></p>
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
                            <tr key={`padding-${index}`} className={`px-4 py-2 ${((table.getRowModel().rows.length + index) % 2) === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-400`}>
                                <td colSpan={columns.length} className="px-4 py-2">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center">
                {/* Button to add new project */}
                <div className="mr-10">
                    <button 
                        onClick={onShowForm}
                        className={`block w-[180px] rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm bg-gtgold text-white hover:bg-gtgoldlight`}
                    >
                        {showForm ? "Close Form" : "Submit New Project"}
                    </button>
                </div>

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
        
    )
};

export default ProjectTable;