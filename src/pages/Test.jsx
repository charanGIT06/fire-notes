import '../scss/index.scss'
import SideNav from "../components/SideNav"
import { Button, Card, CardBody, CardHeader, Heading, Input } from '@chakra-ui/react';
import { useState } from 'react';
import firebase from '../js/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ThemeState from '../context/ThemeContext';

const Test = () => {
  // const { user, profile } = UserAuth();
  // console.log(user)
  // console.log(profile)

  const [email, setEmail] = useState('')
  const [user, setUser] = useState({})
  const { theme } = ThemeState()
  const db = firebase.db

  const getUserFromEmail = async (email) => {
    try {
      const usersCollection = collection(db, 'users')
      const q = query(usersCollection, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      const user = querySnapshot.docs.map(doc => {
        return {
          uid: doc.data().uid,
          email: doc.data().email,
          displayName: doc.data().username,
          firstName: doc.data().profile.firstName,
          lastName: doc.data().profile.lastName,
        }
      })
      if (user.length === 0) {
        setUser({})
        return console.log('No user found')
      }
      return user[0]
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`test-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app container-fluid d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="test p-5 w-100">
          <Card className='bg-dark text-white' style={{ border: '1px solid white' }}>
            <CardHeader>
              <Heading className='p-0 m-0'>Shared</Heading>
            </CardHeader>
            <CardBody>
              <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
              <p>{user && user.uid}</p>
              <p>{user && user.email}</p>
              <p>{user && user.displayName}</p>
              <p>{user && user.firstName}</p>
              <p>{user && user.lastName}</p>
              <Button className='my-2' onClick={() => {
                getUserFromEmail(email).then((user) => {
                  console.log(user)
                })
              }}>Find User</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Test