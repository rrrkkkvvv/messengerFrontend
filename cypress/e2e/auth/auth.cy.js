/// <reference types="cypress" />

describe("Auth test", () => {
  beforeEach(() => {
    // cy.restoreLocalStorage();
    cy.visit("/auth");
  });

  it("Check auth ui", () => {
    cy.get("#toggleSignUpBtn").should("exist");
    if (cy.get("#toggleSignUpBtn").contains("Sign In")) {
      cy.get("#nameInput").should("exist");
    }
    cy.get("#emailInput").should("exist");
    cy.get("#passwordInput").should("exist");
    cy.get("#submitAuthBtn").should("exist");
  });
  it("Sign up", () => {
    cy.signUp();
    console.log("SIGN UP");

    console.log(localStorage.getItem("JWT"));
    console.log("SIGN UP");
    cy.deleteAccount();
  });
  it("Sign in", () => {
    cy.signIn();
    console.log("SIGN IN");

    console.log(localStorage.getItem("JWT"));
    console.log("SIGN IN");
    cy.deleteAccount();
  });
});
