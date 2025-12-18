const testUserData = {
  name: "newuser",
  email: "newuser@gmail.com",
  password: "password",
};

class AuthPage {
  signIn() {
    cy.get("#toggleSignUpBtn").should("exist");
    if (cy.get("#toggleSignUpBtn").contains("Sign In")) {
      cy.get("#toggleSignUpBtn").click();
    }
    cy.get("#emailInput").type(testUserData.email);
    cy.get("#passwordInput").type(testUserData.password);
    cy.get("#submitAuthBtn").click();
  }
  signUp() {
    cy.get("#toggleSignUpBtn").should("exist");

    cy.get("#nameInput").type(testUserData.name);
    const uniqueEmail = `user_${Date.now()}@test.com`;

    cy.get("#emailInput").type(uniqueEmail);
    cy.get("#passwordInput").type(testUserData.password);
    cy.get("#submitAuthBtn").click();
  }
}
export const authPage = new AuthPage();
