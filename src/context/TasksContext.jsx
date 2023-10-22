import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import UserAuth from "./UserContext";
import firebase from "../js/firebase";
import { tasks } from "../pages/Tasks/task-data.json";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  TasksProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db;
  const { user } = UserAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [tasksList, setTasksList] = useState(tasks);
  const [presentTask, setPresentTask] = useState({});
  const [activeTasks, setActiveTasks] = useState([]);
  const [archiveTasks, setArchiveTasks] = useState([]);
  const [trashTasks, setTrashTasks] = useState([]);

  const newTask = async (title) => {
    await addDoc(collection(db, "tasks", user.uid, "active"), {
      title: title,
      items: [],
    });
    setPresentTask({
      title: title,
      items: {
        checked: [],
        unchecked: [],
      },
    });
    getTasks("active");
    navigate("/ptask/tasks");
  };

  const updatePresentTask = async () => {
    try {
      const taskRef = doc(
        collection(db, "tasks", user.uid, "active"),
        presentTask.id
      );
      await updateDoc(taskRef, presentTask).then(() => {
        getTasks("active");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async () => {
    try {
      const taskRef = doc(
        collection(db, "tasks", user.uid, "active"),
        presentTask.id
      );
      await deleteDoc(taskRef).then(() => {
        toast({
          title: "Task deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/tasks");
        getTasks("active");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTasks = async (page) => {
    try {
      const tasks = [];
      const q = query(collection(db, "tasks", user.uid, page));
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tasks.push({ ...doc.data(), id: doc.id });
        });
      });

      if (page === "active") {
        setActiveTasks(tasks);
      } else if (page === "archive") {
        setArchiveTasks(tasks);
      } else if (page === "trash") {
        setTrashTasks(tasks);
      }
    } catch (error) {
      null;
    }
  };

  useEffect(() => {
    getTasks("active");
    getTasks("archive");
    getTasks("trash");
  }, [user]);

  return (
    <TasksContext.Provider
      value={{
        tasksList,
        setTasksList,
        presentTask,
        setPresentTask,
        activeTasks,
        setActiveTasks,
        archiveTasks,
        setArchiveTasks,
        trashTasks,
        setTrashTasks,
        getTasks,
        newTask,
        updatePresentTask,
        deleteTask,
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
