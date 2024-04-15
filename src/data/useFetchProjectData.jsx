import { useMemo, useState, useEffect } from "react";

const useFetchProjectData = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch("https://raw.githubusercontent.com/gt-ospo/oss-project-explorer-data/json-form-test/project_list.json");
                const projects = await response.json()

                setProjects(projects);
            } catch (error) {
                console.error("Something went wrong while fetching the projects...", error);
            }
        }

        fetchProjects();
    }, []);

    const data = useMemo(() => projects, [projects]);

    return (data);
};

export default useFetchProjectData;