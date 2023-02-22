import { Web3Storage } from "web3.storage"

export function getAccessToken () {
  return process.env.WEB3STORAGE_TOKEN
}

export function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() as string })
}