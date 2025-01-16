import { useState, forwardRef } from "react";
import isUrl from "is-url";
import Select from 'react-select';
import { Octokit } from "octokit";
import projectAreaOptions from "../../data/projectAreaOptions";
import licenseOptions from "../../data/licenseOptions";

const ProjectForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectAbstract: '',
    projectAreas: [],
    licenses: [],
    contacts: [{ name: '', email: '' }],
    projectUrl: '',
    guidelinesUrl: ''
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const newContacts = [...formData.contacts];
    newContacts[index][name] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    const newContacts = [...formData.contacts, { name: '', email: '' }];
    if (newContacts.length <= 5) {
      setFormData({ ...formData, contacts: newContacts });
    }
  };

  const removeContact = (index) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setFormData({ ...formData, [name]: values });
  };

  const validateAllFields = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newErrors.projectName = formData.projectName ? '' : 'Please enter a project name';
    newErrors.projectAbstract = formData.projectAbstract ? '' : 'Please enter an abstract on the project';
    
    newErrors.projectUrl = formData.projectUrl ? (isUrl(formData.projectUrl) ? '' : 'URL is not in a valid format') : 'Please enter a URL to the project page';
    newErrors.guidelinesUrl = formData.guidelinesUrl ? (isUrl(formData.guidelinesUrl) ? '' : 'URL is not in a valid format') : '';
    
    newErrors.contacts = formData.contacts.map(contact => {
      let contactError = {};
      contactError.name = contact.name ? '' : 'Please enter a name';
      contactError.email = contact.email ? (emailRegex.test(contact.email) ? '' : 'Contact email is not in valid email format') : '';
      return contactError;
    });

    if (formData.contacts.every(contact => !contact.name && !contact.email)) {
      newErrors.contacts = [{ name: 'Please enter at least one contact' }];
    }

    newErrors.projectAreas = formData.projectAreas.length > 0 ? '' : 'Please choose at least one project area';
    newErrors.licenses = formData.licenses.length > 0 ? '' : 'Please choose at least one license';

    setErrors(newErrors);

    const allFieldsValid = Object.values(newErrors).every(error => {
      if (Array.isArray(error)) {
        return error.every(contactError => 
          Object.values(contactError).every(value => !value)
        );
      }

      return !error;
    })

    return allFieldsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateAllFields();
    
    if (isFormValid && !isSubmitting) {
      setSuccessMessage("Loading please wait...")
      setIsSubmitting(true)

      const octokit = new Octokit({
        auth: "OSPO_EXPLORER_TOKEN",
      });

      // get main branch SHA
      const main_branch_response = await octokit.request('GET /repos/{owner}/{repo}/git/refs/heads/main', {
        owner: "gt-ospo",
        repo: "oss-project-explorer"
      });

      console.debug('GET main', main_branch_response);
      
      let main_branch_sha = null;
      if (main_branch_response.status === 200) {
        main_branch_sha = main_branch_response.data.object.sha;
      }

      const new_branch = crypto.randomUUID();

      // create new branch
      const change_branch_response = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner: "gt-ospo",
        repo: "oss-project-explorer",
        ref: 'refs/heads/' + new_branch,
        sha: main_branch_sha
      });
      console.debug('POST branch', change_branch_response);

      // Create unique filename for entry
      const uniqueFilename = `src/data/submissions/${formData.projectName.replace(/\s+/g, '_')}_${Date.now()}.json`;

      // Turn new file contents to base 64 encoding
      let fileContent = JSON.stringify(formData, null, 2);
      fileContent = btoa(fileContent);

      // post file content
      try {
          let content_response = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: "gt-ospo",
            repo: "oss-project-explorer",
            path: uniqueFilename,
            message: "Inserted new project to project list file",
            content: fileContent,
            branch: new_branch
          });
          console.debug('PUT file', content_response);

          // create pull request
          let pull_response = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
            owner: 'gt-ospo',
            repo: 'oss-project-explorer',
            title: `New Submission: ${formData.projectName}`,
            body: 'Added a new project submission',
            // head: 'gt-ospo-bot:' + new_branch,
            head: new_branch,
            base: 'main'
          });
          console.debug('POST pull', pull_response);
        
        setSuccessMessage("Thank you for submitting your project. Your submission will be reviewed via Github PR, and we will notify you once your project is approved to be added.");
      } catch (error) {
        console.debug('HTTP Error status:', error.status);
        console.debug('HTTP Error request:', error.request);
        console.debug('HTTP Error response:', error.response);
        setSuccessMessage("Something went wrong...please try again.");
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div ref={ref} className="isolate bg-white px-6 py-12 sm:py-12 lg:px-8">

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold font-roboto tracking-tight text-gtblack sm:text-4xl">Open Source Project Information Form</h2>
        <p className="mt-2 text-lg leading-8 text-gtblack">
          Please enter information about the project below
        </p>
      </div>
      <form className="mx-auto mt-16 max-w-xl sm:mt-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <label htmlFor="projectName" className="block font-semibold leading-6 text-gtblack">
              Project Name <span className="text-red-500">*</span>
            </label>

            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                autoComplete="organization"
                placeholder="Enter the project's name"
              />
            </div>
            {errors.projectName && <div className="text-xs text-red-500">{errors.projectName}</div>}

          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectAbstract" className="block font-semibold leading-6 text-gtblack">
              Project Abstract <span className="text-red-500">*</span>
            </label>

            <div className="mt-2.5">
              <textarea
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="projectAbstract"
                value={formData.projectAbstract}
                onChange={handleChange}
                rows={4}
                defaultValue={''}
                placeholder="Enter an abstract on the project"
              />
            </div>
            {errors.projectAbstract && <div className="text-xs text-red-500">{errors.projectAbstract}</div>}
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectAreas" className="block font-semibold leading-6 text-gtblack">
              Project Areas <span className="text-red-500">*</span>
            </label>

            <Select 
              className="block w-full rounded-md border-0 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              isMulti
              name="projectAreas"
              options={projectAreaOptions}
              classNamePrefix="select"
              onChange={(selectedOptions) => handleSelectChange('projectAreas', selectedOptions)} 
            />

            {errors.projectAreas && <div className="text-xs text-red-500">{errors.projectAreas}</div>}

            <div className="mt-2 text-xs text-gray-500">
              <p>Don't see a suitable project area? Select <span className="font-semibold">"Other"</span> and submit the form.</p>
              <p>Submit a request by filling out a <a 
                href="https://github.com/gt-ospo/oss-project-explorer/issues/new?assignees=&labels=&template=00-project-area-request.yml&title=%E2%9C%A8+%5BPROJECT+AREA+REQUEST%5D+-+%3Cinsert+project+area+here%3E"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >GitHub issue</a>, and we'll review it and update your form if needed.</p>
            </div>
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="projectLicenses" className="block font-semibold leading-6 text-gtblack">
              Project Licenses <span className="text-red-500">*</span>
            </label>

            <Select 
              className="block w-full rounded-md border-0 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              isMulti
              name="projectLicenses"
              options={licenseOptions}
              classNamePrefix="select"
              onChange={(selectedOptions) => handleSelectChange('licenses', selectedOptions)} 
            />
            {errors.licenses && <div className="text-xs text-red-500">{errors.licenses}</div>}
          </div>


          <div className="sm:col-span-2 grid grid-cols-1 gap-y-4">
            <label className="block font-semibold leading-6 text-gtblack">
              Primary Contact(s) <span className="text-red-500">*</span>
            </label>

            {formData.contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                
                <div className="col-span-2 flex items-center">
                  <div className="block text-sm font-semibold leading-6 text-gtblack">Contact {index + 1}</div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="ml-auto flex items-center justify-center rounded-full p-1 text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-xs leading-6 text-gtblack">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    type="text" 
                    name="name" 
                    value={contact.name} 
                    onChange={(e) => handleContactChange(index, e)} 
                    placeholder="Enter the contact's full name"
                  />
                  {errors.contacts && errors.contacts[index] && errors.contacts[index].name && <div className="mt-1 text-xs text-red-500">{errors.contacts[index].name}</div>}
                </div>

                <div>
                  <label className="block font-semibold text-xs leading-6 text-gtblack">
                    Email
                  </label>
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    type="text" 
                    name="email" 
                    value={contact.email} 
                    onChange={(e) => handleContactChange(index, e)} 
                    placeholder="Enter the contact's email"
                  />
                  {errors.contacts && errors.contacts[index] && errors.contacts[index].email && <div className="mt-1 text-xs text-red-500">{errors.contacts[index].email}</div>}
                </div>

              </div>
            ))}
          </div>


          {formData.contacts.length < 3 && (
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={addContact}
                className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add new Contact
              </button>
            </div>
          )}


          <div className="sm:col-span-2">
            <label htmlFor="projectUrl" className="block font-semibold leading-6 text-gtblack">
              Project Page URL <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="tel"
                name="projectUrl"
                autoComplete="tel"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="Enter a valid URL to the project page"
              />
            </div>
            {errors.projectUrl && <div className="text-xs text-red-500">{errors.projectUrl}</div>}
          </div>


          <div className="sm:col-span-2">
            <label htmlFor="guidelinesUrl" className="block font-semibold leading-6 text-gtblack">
              Community Contribution Guidelines URL
            </label>

            <div className="relative mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gtblack shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="tel"
                name="guidelinesUrl"
                autoComplete="tel"
                value={formData.guidelinesUrl}
                onChange={handleChange}
                placeholder="Enter a valid URL to the community contribution guidelines page URL"
              />
            </div>
            {errors.guidelinesUrl && <div className="text-xs text-red-500">{errors.guidelinesUrl}</div>}
          </div>


        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm ${
              isSubmitting ? 'bg-gray-400 text-gray-200' : 'bg-gtgold text-white hover:bg-gtgoldlight'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            Submit
          </button>

          {successMessage && (
            <label htmlFor="successMessage" className="block font-semibold leading-6 text-gtblack pt-3">
              {successMessage}
            </label>
          )}
        </div>
      </form>
    </div>
  );
});

export default ProjectForm;