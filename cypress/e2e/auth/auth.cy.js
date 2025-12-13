/// <reference types="cypress" />
const url = import.meta.env.VITE_DEV
  ? // ? "http://localhost:3000"
    "http://192.168.0.122:3000"
  : "https://messengerbackend-3qj2.onrender.com";

const testUserData = {
  username: "new user",
  email: "newuser@gmail.com",
  password: "password",
};

describe("Auth test", () => {
  beforeEach(() => {
    cy.visit(url + "/auth");
  });
  it("Check auth ui", () => {
    cy.get("#toggleSignUpBtn").should("exists");
    if (cy.get("#toggleSignUpBtn").contains("Sign In")) {
      cy.get("#nameInput").should("exists");
    }
    cy.get("#emailInput").should("exists");
    cy.get("#passwordInput").should("exists");
    cy.get("#submitAuthBtn").should("exists");
  });
});
