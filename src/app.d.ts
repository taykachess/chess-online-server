// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
  interface Locals {
    user: import('$types/user').DecodedUser
  }

  interface PageData {
    user?: import('$types/user').DecodedUser
    gameIds?: string[]
  }
}
