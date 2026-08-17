import React from "react";
import projectAreaOptions from "../../data/projectAreaOptions";

const ProjectAreaFilter = ({ onProjectAreaFilterChange }) => {
    return (
        <div>
            <h2 className="flex text-xl font-semibold pb-3">Project Area</h2>
            <div className="flex flex-col gap-2">
                {projectAreaOptions.slice(0,-1).map(option => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="checkbox"
                            id={option.value}
                            name={option.value}
                            value={option.value}
                            onChange={onProjectAreaFilterChange}
                            className="w-5 h-5 rounded"
                        />
                        <label htmlFor={option.value} className="ml-2">{option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ProjectAreaFilter;