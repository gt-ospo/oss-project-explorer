const { Octokit } = require("@octokit/core");

const aggregateSubmissions = async (octokit) => {
  const owner = "gt-ospo";
  const repo = "oss-project-explorer";
  const submissionsPath = "src/data/submissions";
  const projectListPath = "src/data/project_list.json";

  try {
    // Fetch the list of files in the submissions folder
    const submissionsResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: submissionsPath,
    });

    if (submissionsResponse.data.length === 0) {
      console.log("No new submission files found.");
      return;
    }

    // Fetch the current project_list.json file
    const projectListResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: projectListPath,
    });

    const projectListContent = JSON.parse(Buffer.from(projectListResponse.data.content, 'base64').toString());
    const projectListSha = projectListResponse.data.sha;

    // Process each submission file
    for (const file of submissionsResponse.data) {
      if (file.type === "file" && file.name.endsWith(".json")) {
        console.log(`Processing file: ${file.name}`);

        // Fetch the content of the submission file
        const fileResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: file.path,
        });

        const submissionContent = JSON.parse(Buffer.from(fileResponse.data.content, 'base64').toString());

        // Append submission content to the project list
        projectListContent.push(submissionContent);

        // Delete the submission file
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: file.path,
          message: `Processed and removed submission file: ${file.name}`,
          sha: fileResponse.data.sha,
        });

        console.log(`Successfully processed and removed file: ${file.name}`);
      }
    }

    // Update the project_list.json file
    const updatedContent = Buffer.from(JSON.stringify(projectListContent, null, 2)).toString('base64');
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: projectListPath,
      message: "Updated project_list.json with new submissions",
      content: updatedContent,
      sha: projectListSha,
    });

    console.log("Aggregation completed successfully.");
  } catch (error) {
    console.error("Unexpected error:", error.response?.data || error.message);
    throw error;
  }
};

// Initialize Octokit
const octokit = new Octokit({
    auth: "OSPO_EXPLORER_TOKEN",
});

// Run the aggregation script
(async () => {
  try {
    await aggregateSubmissions(octokit);
  } catch (error) {
    if (error.status === 404) {
      console.error("Submissions folder does not exist. Skipping aggregation.");
    } else {
      console.error("Unexpected error during aggregation:", error);
      process.exit(1); // Exit with a failure code for CI/CD
    }
  }
})();
