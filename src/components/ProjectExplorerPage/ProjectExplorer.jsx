import React from "react";
import { useState, useEffect, useRef } from "react";

import ProjectForm from "../ProjectFormPage/ProjectForm";
import AboutSection from "../AboutSection/AboutSection";
import TitleBar from "../TitleBar/TitleBar";
import ProjectAreaFilter from "../ProjectAreaFilter/ProjectAreaFilter";
import LicenseFilter from "../LicenseFilter/LicenseFilter";
import ProjectTable from "../ProjectTable/ProjectTable";

function ProjectExplorer() {
    const [showForm, setShowForm] = useState(false);
    const [selectedProjectAreas, setSelectedProjectAreas] = useState([]);
    const [selectedLicenses, setSelectedLicenses] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const projectFormRef = useRef(null);

    // Handles input text to search bar
    const handleSearchBarChange = (e) => {
        const value = e.target.value
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "projectName"),
            { id: "projectName", value: value},
        ]);
    };
    
    // Handles project area filter boxes interactions
    const handleProjectAreaChange = (e) => {
        const value = e.target.value;
        setSelectedProjectAreas(prev => 
            e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
        );
    };
    useEffect(() => {
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "projectAreas"),
            { id: "projectAreas", value: selectedProjectAreas }
        ])
    }, [selectedProjectAreas]);
    
    // Handles project license filter boxes interactions
    const handleLicenseChange = (e) => {
        const value = e.target.value;
        setSelectedLicenses(prev => 
            e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
        );
    };
    useEffect(() => {
        setColumnFilters(old => [
            ...old.filter(filter => filter.id !== "licenses"),
            { id: "licenses", value: selectedLicenses }
        ])
    }, [selectedLicenses]);

    const handleShowForm = () => {
        setShowForm(!showForm)

        if (!showForm) {
            // Use a timeout to allow for the component to render
            setTimeout(() => {
                // Scroll the ProjectForm into view
                projectFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <div className="shrink-0 bg-white z-10 shadow-sm relative">
                <TitleBar onSearchChange={handleSearchBarChange} />
            </div>

            <div className="flex flex-col lg:flex-row flex-1 max-w-[1600px] w-full mx-auto">
                {/* Filter and Button Column */}
                <div className="order-2 lg:order-1 flex flex-col p-4 bg-gray-50 lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-r border-gray-200">
                    <div className="mt-0">
                        <ProjectAreaFilter onProjectAreaFilterChange={handleProjectAreaChange} />
                    </div>
                    <div className="mt-6">
                        <LicenseFilter onLicenseFilterChange={handleLicenseChange} />
                    </div>
                </div>

                {/* Table and Nav Bar */}
                <div className="order-1 lg:order-2 flex-grow flex flex-col w-full relative min-w-0">
                    <div className="p-4 sm:p-6 w-full max-w-full">
                        <div className="mb-6">
                            <AboutSection />
                        </div>
                        <ProjectTable columnFilters={columnFilters} showForm={showForm} onShowForm={handleShowForm} />
                        {showForm && (
                            <div className="mt-8 border-t border-gray-300 pt-8" ref={projectFormRef}>
                                <ProjectForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectExplorer;