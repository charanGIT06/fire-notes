import { Checkbox, Input } from "@chakra-ui/react";
import TasksState from "../context/TasksContext";
import propTypes from "prop-types";

const Task = ({ checked, task }) => {
  //eslint-disable-line

  const { tasks, setTasks, completedTasks, setCompletedTasks } = TasksState();

  return (
    <div className='task d-flex align-items-center'>
      <Checkbox
        isChecked={checked}
        colorScheme='yellow'
        onChange={() => {
          if (checked) {
            setTasks([...tasks, task].sort());
            setCompletedTasks(completedTasks.filter((t) => t.id !== task.id));
          } else {
            setCompletedTasks([...completedTasks, task].sort());
            setTasks(tasks.filter((t) => t.id !== task.id));
          }
        }}
      ></Checkbox>
      <Input
        id={task}
        className='ms-2 ps-1 py-1'
        type='text'
        variant={"unstyled"}
        defaultValue={task.value}
      />
    </div>
  );
};

export default Task;
