import { Buffer } from 'buffer'
import axios from 'axios'

const tokenName = 'SPECTRUM-TOKEN'

// This function is going to extract the payload from the JWT the user has stored in localStorage
export const getPayload = () => {
  const token = localStorage.getItem(tokenName) // get full token from localStorage
  if (!token) return
  const splitToken = token.split('.') // split token into 3 parts using split
  const payloadString = splitToken[1] // take the middle payload string and save it to a variable
  return JSON.parse(Buffer.from(payloadString, 'base64'))
}

// This function is going to use the payload to check the validity of the token
// It will do this by checking the expiry date
export const isAuthenticated = () => {
  const payload = getPayload() // get payload object containing the expiry date under the exp key
  if (!payload) return false // if it's undefined, it doesn't exist and so we return false
  const currentTime = Date.now() / 1000 // we get the current time by using Date.now() but need to convert to seconds from miliseconds so divide by 1000
  return currentTime < payload.exp // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
}

export const getUserID = () => {
  const payload = getPayload() // get payload object containing the expiry date under the exp key
  if (!payload) return false // if it's undefined, it doesn't exist and so we return false
  return payload.sub // finally we check if the expiry is bigger than the current timestamp, if it is, it's valid
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

export const authenticated = axios.create({
  baseURL: '',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

export const userIsOwner = (mixtape) => {
  const payload = getPayload()
  if (!payload) return
  if (mixtape){
    return payload.sub === mixtape.addedBy._id
  }
}

export const removeToken = () => {
  localStorage.removeItem(tokenName)
}