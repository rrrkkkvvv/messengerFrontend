/// <reference types="cypress" />

import { apiURLs, strValues } from "../config";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
let LOCAL_STORAGE_MEMORY: Record<string, string> = {};
Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});
Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
Cypress.Commands.add("registerNewAccount", () => {
  const date = Date.now();
  cy.request("POST", apiURLs.baseURL + apiURLs.paths.auth.signUpPath, {
    name: `user_${date}`,
    email: `user_${date}@test.com`,
    password: strValues.testAccountPassword,
  }).then(({ body }) => {
    console.log("BODY");
    console.log(body);
    console.log("BODY");
    return {
      token: body.data.token,
      user: body.data.user,
    };
  });
});
Cypress.Commands.add("signUp", () => {
  cy.registerNewAccount().then((data) => {
    const token = data.token;
    cy.wrap(token).as("token");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("JWT", data.token);
        win.localStorage.setItem("isLoggedIn", "loggedIn");
      },
    });
  });
});
Cypress.Commands.add("signIn", () => {
  cy.registerNewAccount().then((data) => {
    console.log("DATA");
    console.log(data);
    console.log("DATA");
    cy.request("POST", apiURLs.baseURL + apiURLs.paths.auth.signInPath, {
      email: data.user.email,
      password: strValues.testAccountPassword,
    }).then(({ body }) => {
      console.log(body);
      const token = body.data.token;
      cy.wrap(token).as("token");

      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("JWT", body.data.token);
          win.localStorage.setItem("isLoggedIn", "loggedIn");
        },
      });
    });
  });
});
Cypress.Commands.add("deleteAccount", function () {
  cy.request({
    method: "DELETE",
    url: apiURLs.baseURL + apiURLs.paths.user.deleteAccount,
    headers: {
      authorization: `Bearer ${this.token}`,
    },
  });
});
