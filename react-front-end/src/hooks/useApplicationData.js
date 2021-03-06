
import { useState, useEffect } from "react";
import axios from "axios";
const testData = [{
  id: 0,
  title: 'All Day Event very long title',
  allDay: true,
  start: new Date(2020, 11, 0),
  end: new Date(2020, 11, 1),
},
{
  id: 1,
  title: 'Long Event',
  start: new Date(2020, 11, 7),
  end: new Date(2020, 11, 10),
},

{
  id: 2,
  title: 'DTS STARTS',
  start: new Date(2020, 11, 13, 0, 0, 0),
  end: new Date(2020, 11, 20, 0, 0, 0),
},

{
  id: 3,
  title: 'DTS ENDS',
  start: new Date(2020, 11, 6, 0, 0, 0),
  end: new Date(2020, 11, 13, 0, 0, 0),
},

{
  id: 4,
  title: 'Some Event',
  start: "2020, 11, 9",
  end: "2020, 11, 16",
},
{
  id: 5,
  title: 'Conference',
  start: new Date(2020, 11, 11),
  end: new Date(2020, 11, 13),
  desc: 'Big conference for important people',
}];

const jobsData = [{
  assignments: [{
    admin: null,
    ends: "04/01/2020",
    estimate_hrs: 1020,
    first_name: "Hillyer",
    id: 49,
    job_id: 1,
    last_name: "Morrel",
    starts: "16/12/2020",
    user_id: 49
  }],
  calendarIDs: [],
  customer_address: "35 Straubel Street",
  customer_city: "Arcoverde",
  customer_email: "bnickoll6@wunderground.com",
  customer_first_name: "Bamby",
  customer_last_name: "Nickoll",
  customer_phone_number: "835-489-3765",
  estimate_total_time: 1110,
  estimate_total_workers: 5,
  estimate_travel_time: 180,
  id: 11,
  name: "nunc viverra dapibus",
  notes: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.↵↵In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
  requirements: [{
    description: "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    difficulty: 10,
    estimate_time: 780,
    estimate_workers: 1,
    id: 7,
    job_id: 11,
    name: "decks",
    task_id: 7
  }],
  status: "Quote Requested"},
  {
  assignments: [],
  calendarIDs: [],
  customer_address: "35 Straubel Street",
  customer_city: "Arcoverde",
  customer_email: "bnickoll6@wunderground.com",
  customer_first_name: "Bamby",
  customer_last_name: "Nickoll",
  customer_phone_number: "835-489-3765",
  estimate_total_time: 1110,
  estimate_total_workers: 5,
  estimate_travel_time: 180,
  id: 11,
  name: "nunc viverra dapibus",
  notes: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.↵↵In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
  requirements: [],
  status: "Quote Requested"
}];

/**
 * useApplicationData - a custom hook for managing
 * main site data and maintaining consistency with the server 
 */
export default function useApplicationData(){
  //*****STATE HOOKS START
  //calendar - the main calendar data
  const [calendar, setCalendar] = useState(testData);
  //bookings - holds all the data about bookings(not just what can be passed to calendar)
  const [jobs, setJobs] = useState(jobsData);
  // Tasks - holds the tasks data to choose from ing the new job form
  const [tasks, setTasks] = useState([]);
  // Users - holds all the users data to render them in assign worker component
  const [users, setUsers] = useState([]);
  //*****STATE HOOKS END

  //Load all initial site data
  useEffect(() => {
    Promise.all([
      axios.get("/api/jobs"),
      axios.get("/api/tasks"),
      axios.get("/api/users")
      //OTHER INITIAL SITE LOAD DATA REQUESTS HERE
    ])
      .then((all) => {
        //load bookings into calendar array
        let jobList = all[0].data;
        setJobs(jobList);
        //OTHER INITIAL SITE LOAD DATA SAVING HERE
        //set the tasks data
        setTasks(all[1].data);
        // sets the users data
        setUsers(all[2].data);
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  }, []);

  useEffect(() => {
    let calendarEntries = [];
    for (const job of jobs) {
      let dates = [];
      for (const assignment of job.assignments) {
        if (!dates.includes(assignment.starts)) {
          dates.push(assignment.starts);
          let index = calendarEntries.length;
          calendarEntries.push({
            id: index,
            title: job.name,
            desc: `Workers: ${job.estimate_total_workers}, Time(p-hrs): ${job.estimate_total_time}`,
            start: (new Date(assignment.starts)),
            end: (new Date(assignment.ends)),
            job_id: job.id,
          });
        }
      }
    }
    setCalendar(calendarEntries);
  }, [jobs])

  const addChangeJob = function(jobDetails) {
    //check if it is a new job, then all details will be new
    if (!jobDetails.id) {
      //job id=0 -> new job
      jobDetails.id = 0;
    }
    console.log("************saving Job*************")
    return axios.put(`/api/jobs/${jobDetails.id}`, jobDetails)
    .then((response) => {
      let newJob = {...jobDetails, id: parseInt(response.data)};
      setJobs((old) => {
        let output = [...old]
        let index = output.map((job) => job.id).indexOf(newJob.id);
        if (index >= 0) {
          output[index] = {...output[index], ...newJob};//replaces only the keys in newJob
        } else {
          newJob.assignments = [];
          newJob.requirements = [];
          output.push(newJob);
        }
        return output;
      });
      return newJob.id;
    })
    .catch((e) => {
      console.log("*************Error Saving Job************");
      return e;
    });
  };

  function cancelJob(id) {
    //request that the server delete the Job
    return axios.delete(`/api/jobs/${id}`)
    .then(() => {
      let jobIndex = jobs.map((job) => job.id).indexOf(id);
      let newJobs = [...jobs];
      newJobs.splice(jobIndex, 1);
      setJobs(newJobs);
    })
    .catch((e) => {
      console.log("*************Error Deleting Job************");
      console.log("error", e);
      return e;
    });
  };

  const addChangeAssignment = function(assignmentDetails) {
    //check if it is a new assignment, then all details will be new
    if (!assignmentDetails.id) {
      //job id=0 -> new job
      assignmentDetails.id = 0;
    }

    return axios.put(`/api/assignments/${assignmentDetails.id}`, assignmentDetails)
    .then((response) => {
      let newAssignment = {...response.data};
      setJobs((old) => {
        let output = [...old]
        let jobIndex = output.map((job) => job.id).indexOf(newAssignment.job_id);
        let assignmentIndex = output[jobIndex].assignments.map((assignment) => assignment.id).indexOf(newAssignment.id);
        if (assignmentIndex >= 0) {
          output[jobIndex].assignments[assignmentIndex] = {...newAssignment};
        } else {
          output[jobIndex].assignments.push(newAssignment);
        }
        return output;
      });
      return response.data.id;
    })
    .catch((e) => {
      console.log("*************Error Saving Assignment************");
      return e;
    });
  };

  function cancelAssignment(id) {
    //request that the server delete the Job
    return axios.delete(`/api/assignments/${id}`)
    .then(() => {
      let jobList = [...jobs];
      for (let i = 0; i < jobList.length; i++) {
        for(let j = 0; j < jobList[i].assignments.length; j++) {
          if (jobList[i].assignments[j].id === id) {
            jobList[i].assignments.splice(j, 1);
            setJobs(jobList);
            return;
          }
        }
      }
    })
    .catch((e) => {
      console.log("*************Error Deleting Assignment************");
      return e;
    });
  };

  const addChangeRequirement = function(requirementDetails) {
    //check if it is a new requirement, then all details will be new
    if (!requirementDetails.id) {
      //job id=0 -> new job
      requirementDetails.id = 0;
    }

    return axios.put(`/api/requirements/${requirementDetails.id}`, requirementDetails)
    .then((response) => {
      let newRequirement = {...response.data};
      setJobs((old) => {
        let output = [...old]
        let jobIndex = output.map((job) => job.id).indexOf(newRequirement.job_id);
        let requirementIndex = output[jobIndex].requirements.map((requirement) => requirement.id).indexOf(newRequirement.id);
        if (requirementIndex >= 0) {
          output[jobIndex].requirements[requirementIndex] = {...newRequirement};
        } else {
          output[jobIndex].requirements.push(newRequirement);
        }
        return output;
      });
      return response.data.id;
    })
    .catch((e) => {
      console.log("*************Error Saving Requirement************");
      return e;
    });
  };

  function cancelRequirement(id) {
    //request that the server delete the Job
    return axios.delete(`/api/requirements/${id}`)
    .then(() => {
      let jobList = [...jobs];
      for (let i = 0; i < jobList.length; i++) {
        for(let j = 0; j < jobList[i].requirements.length; j++) {
          if (jobList[i].requirements[j].id === id) {
            jobList[i].requirements.splice(j, 1);
            setJobs(jobList);
            return;
          }
        }
      }
    })
    .catch((e) => {
      console.log("*************Error Deleting Requirement************");
      return e;
    });
  };

  return {
    tasks,
    users,
    jobs,
    calendar,
    addChangeJob,
    cancelJob,
    addChangeRequirement,
    cancelRequirement,
    addChangeAssignment,
    cancelAssignment,
  };
};


