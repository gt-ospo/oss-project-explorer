import React from "react";

const AboutSection = () => {
    return (
        <div className="w-full py-4 px-4 bg-gray-100 rounded-lg shadow-sm text-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">About This Resource</h2>
            <p className="text-gray-700">This page provides an overview of Georgia Tech open source research projects curated by the Georgia Tech Open Source Program Office (OSPO). PIs and researchers can submit their work via the Submit New Project form below.</p>
            <br />
            <p className="text-gray-700">For questions, reach out at <a href="mailto:ospo-directors@gatech.edu" className="text-gtgold hover:text-gtgoldlight font-medium">ospo-directors@gatech.edu</a>. To use this project, see <a href="https://github.com/gt-ospo/oss-project-explorer" className="text-gtgold hover:text-gtgoldlight font-medium" target="_blank" rel="noreferrer">our GitHub site</a>.</p>
        </div>
    )
}

export default AboutSection;
