import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import UserAuth from "./UserContext";
import firebase from "../js/firebase";
import { v4 as uuidv4 } from "uuid";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  TasksProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db;
  const { user } = UserAuth();

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleChange = () => {
    console.log("changed");
  };

  const getTasks = async () => {
    const tasks = doc(db, "tasks", user.uid);
    await getDoc(tasks).then((docSnap) => {
      if (docSnap.exists()) {
        setTasks(docSnap.data().tasks);
      } else {
        // doc.data() will be undefined in this case
        setTasks([]);
        console.log("No such document!");
      }
    });
  };

  const newTask = async (task) => {
    // const time = new Date().getTime();
    // setTasks([...tasks, [task, time.toString()]]);

    const tasksColl = collection(db, "tasks");
    const userTasks = doc(tasksColl, user.uid);
    await updateDoc(userTasks, {
      tasks: [
        ...tasks,
        {
          value: task,
          id: uuidv4(),
          createdAt: new Date().getTime(),
        },
      ],
    });
  };

  useEffect(() => {
    if (user && user.uid !== undefined) {
      getTasks();
    }
  }, [user]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        completedTasks,
        setCompletedTasks,
        handleChange,
        newTask,
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
