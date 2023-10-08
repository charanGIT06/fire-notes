import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import UserAuth from "./UserContext";
import firebase from "../js/firebase";
import { v4 as uuidv4 } from "uuid";
import {tasks} from '../pages/Tasks/task-data.json';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  TasksProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db;
  const { user } = UserAuth();

  const [tasksList, setTasksList] = useState(tasks);
  const [presentTask, setPresentTask] = useState({});

  return (
    <TasksContext.Provider
      value={{
        tasksList,
        setTasksList,
        presentTask,
        setPresentTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

const TasksState = () => {
  return useContext(TasksContext);
};

export default TasksState;
