import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebase = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: 'AIzaSyBS7Tuwrm-2OMY4lWjOLa-2d72sC2j03Uc',
      authDomain: 'techtalkjp.firebaseapp.com',
      databaseURL: 'https://techtalkjp.firebaseio.com',
      projectId: 'techtalkjp',
      storageBucket: 'techtalkjp.appspot.com',
      messagingSenderId: '589381418154',
      appId: '1:589381418154:web:b22a2ab91ebcdba0cc24d3'
    })

export const auth = getAuth(firebase)
export const googleAuthProvider = new GoogleAuthProvider()
export const firestore = getFirestore(firebase)
