import { useState, createContext, useContext } from 'react';
import propTypes from 'prop-types';
import firebase from '../js/firebase.js'
import { useToast } from '@chakra-ui/react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  UserProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const auth = firebase.auth;
  const db = firebase.db;
  const toast = useToast();
  const navigate = useNavigate()

  const [user, setUser] = useState({})
  const [profile, setProfile] = useState()

  const setProfileDetails = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    await onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setProfile({
          uid: user.uid,
          displayName: data.username,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          email: data.email,
        })
      });
    });
  }

  const createUser = async (username, firstName, lastName, email, password) => {
    console.log(username, firstName, lastName, email, password)
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, {
        displayName: username,
      });
      setUser(user)
      console.log(profile)
      const usernamesRef = collection(db, "usernames");
      const newUsernameRef = doc(usernamesRef, user.uid);
      setDoc(newUsernameRef, {
        uid: user.uid,
        displayName: username
      }).then(() => {
        console.log("Username Added!");
      });

      const usersRef = collection(db, "users");
      const newUserRef = doc(usersRef, user.uid);
      setDoc(newUserRef, {
        uid:user.uid,
        username: username,
        email: email,
        password: password,
        profile: {
          firstName: firstName,
          lastName: lastName,
        }
      }).then(() => {
        setProfile(
          {
            uid: user.uid,
            displayName: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
          }
        )
        console.log("User Added!");
      })

      navigate(`/profile/${username}`);
      toast({
        title: "Account Created",
        description: "Your account has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  }

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user)
        navigate('/')
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    });

    return () => {
      unsubscribe();
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, setUser, profile, setProfile, setProfileDetails, login, createUser }}>
      {children}
    </UserContext.Provider>
  )
}

const UserAuth = () => {
  return useContext(UserContext)
}

export default UserAuth;