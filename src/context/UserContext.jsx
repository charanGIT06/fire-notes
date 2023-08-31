import { useState, createContext, useContext } from 'react';
import propTypes from 'prop-types';
import firebase from '../js/firebase.js'
import { useToast } from '@chakra-ui/react';
import { FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
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
  const [usernames, setUsernames] = useState([])

  // const setProfileDetails = async (username) => {
  //   const usersRef = collection(db, "users");
  //   const q = query(usersRef, where("displayName", "==", username));
  //   onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       // setProfile({
  //       //   uid: user.uid || '',
  //       //   displayName: data.displayName || '',
  //       //   firstName: data.profile.firstName || '',
  //       //   lastName: data.profile.lastName || '',
  //       //   email: data.email || '',
  //       // })
  //     });
  //   });
  // }

  const updateProfileDetails = (firstName, lastName, location) => {
    const profileRef = doc(collection(db, 'users'), user.uid);
    updateDoc(profileRef, {
      profile: {
        firstName: firstName,
        lastName: lastName,
        location: location,
      }
    }).catch((error) => {
      console.error('Error updating document: ', error);
    }
    );
  }

  const updateCurrentUser = async () => {
    setTimeout(() => {
      if (user && user.uid) {
        const userRef = doc(collection(db, 'users'), user.uid);
        onSnapshot(userRef, (doc) => {
          setUser({
            ...user,
            firstName: doc.data().profile.firstName || '',
            lastName: doc.data().profile.lastName || '',
            location: doc.data().profile.location || '',
          })
        })
      }
    }, 2000)
  }

  const createUser = async (profile) => {
    await createUserWithEmailAndPassword(auth, profile.email, profile.password).then((userCredential) => {
      const user = userCredential.user;

      // Updating displayName
      updateProfile(user, {
        displayName: profile.displayName,
      }).then(() => {
        // Adding name to user object
        setUser({
          ...user,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
        })
      }).catch((error) => {
        console.log(error)
      });

      // Adding username to usernames collection
      const newUsernameRef = doc(collection(db, "usernames"), user.uid);
      setDoc(newUsernameRef, {
        uid: user.uid,
        displayName: profile.displayName
      }).catch((error) => {
        console.log(error)
      });

      // Adding user to users collection
      const newUserRef = doc(collection(db, 'users'), user.uid);
      setDoc(newUserRef, {
        uid: user.uid,
        displayName: profile.displayName || '',
        email: profile.email,
        password: profile.password,
        profile: {
          firstName: profile.firstName || "",
          lastName: profile.lastName || '',
        }
      }).catch((error) => {
        console.log(error);
      })

      navigate('/');
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

        const ProfileRef = doc(collection(db, 'users'), user.uid);
        onSnapshot(ProfileRef, (doc) => {
          const data = doc.data();
          setUser({
            ...user,
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
          })
        })
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

  const facebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider).then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; //eslint-disable-line
        const user = result.user;
        navigate('/');
        setUser(user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; //eslint-disable-line
        const user = result.user;

        if (usernames.includes(user.displayName)) {
          console.log("Username already exists");
        } else {
          setUser(user);
          const usersRef = collection(db, "users");
          const newUserRef = doc(usersRef, user.uid);
          console.log(user)
          setDoc(newUserRef, {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email,
            profile: {
              firstName: user.firstName || "",
              lastName: user.lastName || '',
              location: user.location || ''
            }
          }).then(() => {
            navigate('/');
            console.log("User Added!");
          })
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUsernames = async () => {
    const q = query(collection(db, "usernames"));
    const querySnapshot = await getDocs(q);
    const usernames = [];
    querySnapshot.forEach((doc) => {
      usernames.push(doc.data().displayName);
    });
    setUsernames(usernames);
  };

  useEffect(() => {
    getUsernames();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    });

    return () => {
      unsubscribe();
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, setUser, updateCurrentUser, login, createUser, googleLogin, facebookLogin, updateProfileDetails, usernames, getUsernames }}>
      {children}
    </UserContext.Provider>
  )
}

const UserAuth = () => {
  return useContext(UserContext)
}

export default UserAuth;