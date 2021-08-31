import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

if (!getApps().length) {
  const app = initializeApp({
    apiKey: 'AIzaSyBS7Tuwrm-2OMY4lWjOLa-2d72sC2j03Uc',
    authDomain: 'techtalkjp.firebaseapp.com',
    databaseURL: 'https://techtalkjp.firebaseio.com',
    projectId: 'techtalkjp',
    storageBucket: 'techtalkjp.appspot.com',
    messagingSenderId: '589381418154',
    appId: '1:589381418154:web:b22a2ab91ebcdba0cc24d3'
  })
  if (typeof window !== undefined) getAnalytics(app)
}
