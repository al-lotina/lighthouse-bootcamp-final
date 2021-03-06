import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import { Grid } from '@material-ui/core';
import { Typography,TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBlock: 20,
    width: '100%',
    maxWidth: 'auto',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '49vh',
  },
  container: {
    maxHeight: 200,
  },
  mainContainer: {
    height: "62vh",
  }
}));

export default function AssignWorker({requirements, users, assignments, setAssignments, jobId, newJob, cancelAssignment}) {
  //******************************************************************************************************* */
  const [start, setStart] = useState((newJob || assignments.length === 0) ? '' : assignments[0].starts);
  const [end, setEnd] = useState((newJob || assignments.length === 0) ? '' : assignments[0].ends);
  //********************************************************************* */
  const classes = useStyles();
  const [checkedEmployee, setCheckedEmployee] = useState(newJob ? [] : assignments);
  const jobSkills = requirements.map(requirement => requirement.task_id);
  const checkedUsers = [];
  assignments.forEach(assignment => checkedUsers.push(assignment.user_id));
  const filteredUsers = function (users, jobSkills, checkedUsers) {
    const userAccum = [];
    users.forEach (user => {
      if (checkedUsers.includes(user.id) && !newJob) {
        userAccum.push(user);
      }
      user.skills.forEach(skill => {
        if (jobSkills.includes(skill.task_id)) {
          userAccum.push(user)
        }
      })
    })
    return userAccum;
  };
  
  const userList = filteredUsers(users,jobSkills, checkedUsers)

  const usersWithoutDuplicate = userList.filter((item, index) => userList.indexOf(item) === index)

  const handleToggle = (value) => () => {
    const currentIndex = checkedEmployee.map(e => e.user_id).indexOf(value.id);
    const newChecked = [...checkedEmployee];
    if (currentIndex === -1) {
      newChecked.push({job_id: jobId, user_id: value.id, starts: start, ends: end});
    } else {
      if (!newJob && newChecked[currentIndex].id){
        cancelAssignment(newChecked[currentIndex].id);
      }
      newChecked.splice(currentIndex, 1);
    }
    setAssignments(newChecked);
    setCheckedEmployee(newChecked);
  };
  const setStartTime = function(time) {
    setStart(time);
    setAssignments((oldList) => {
      let newList = [...oldList];
      for (let i = 0; i < newList.length; i++) {
        newList[i].starts = time;
      }
      return newList;
    })
  }

    const setEndTime = function(time) {
    setEnd(time);
    setAssignments((oldList) => {
      let newList = [...oldList];
      for (let i = 0; i < newList.length; i++) {
        newList[i].ends = time;
      }
      return newList;
    })
  }

  return (
    <div className={classes.mainContainer}>
      <Typography variant="h6" gutterBottom align="left">
        Assign Worker
      </Typography>
      <Grid container justify="space-between">
        <Grid item xs={12} sm={5}>
          <TextField
            required
            id="datetime-local"
            label="Start"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={start}
            onChange={e => setStartTime(e.target.value)}
            />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            required
            id="datetime-local"
            label="End"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={end}
            onChange={e => setEndTime(e.target.value)}
            />
        </Grid>        
          <List dense className={classes.root}>
            {usersWithoutDuplicate.map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem key={value.id} button >
                  <ListItemAvatar>
                    <Avatar
                      alt={`${value.first_name[0]}`}
                      src={value.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`${value.first_name} ${value.last_name}`} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(value)}
                      checked={checkedEmployee.map(e => e.user_id).indexOf(value.id) !== -1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>       
      </Grid>
    </div>
  );
}