import React from "react";
import licenseOptions from "../../data/licenseOptions";

const LicenseFilter = ({ onLicenseFilterChange }) => {
    return (
        <div>
            <h2 className="flex text-xl font-semibold pb-3 pt-5">License</h2>
            <div className="flex flex-col gap-2">
                {licenseOptions.map(option => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="checkbox"
                            id={option.value}
                            name={option.value}
                            value={option.value}
                            onChange={onLicenseFilterChange}
                            className="w-5 h-5 rounded"
                        />
                        <label htmlFor={option.value} className="ml-2">{option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LicenseFilter;