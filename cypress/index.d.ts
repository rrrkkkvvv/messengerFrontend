/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    registerNewAccount(): Chainable<{
      user: { _id: string; name: string; email: string };
      token: string;
    }>;
    signIn(): Chainable<void>;
    signUp(): Chainable<void>;
    saveLocalStorage(): Chainable<void>;
    restoreLocalStorage(): Chainable<void>;
    deleteAccount(): Chainable<void>;
  }
}
