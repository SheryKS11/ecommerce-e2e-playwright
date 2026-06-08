@account
Feature: Account Management
  As a user of the LambdaTest eCommerce Playground
  I want to manage my account
  So that I can register, login, logout and update my preferences

  # TC01 - Smoke
  @smoke @TC01
  Scenario: Home page loads successfully
    Given I navigate to the home page
    Then the page title should contain "Your Store"

  # TC02 - Positive
  @positive @TC02
  Scenario: Register a new account with valid details
    Given I navigate to the registration page
    When I fill in valid registration details with a unique email
    And I agree to the privacy policy
    And I submit the registration form
    Then I should see "Your Account Has Been Created"

  # TC03 - Negative
  @negative @TC03
  Scenario: Register with a duplicate email shows warning
    Given I navigate to the registration page
    When I fill in registration details with an already registered email
    And I agree to the privacy policy
    And I submit the registration form
    Then I should see a warning containing "already registered"

  # TC04 - Negative
  @negative @TC04
  Scenario: Register with missing required fields shows validation errors
    Given I navigate to the registration page
    When I submit the registration form without filling any fields
    Then field validation errors should be displayed

  # TC05 - Boundary
  @boundary @TC05
  Scenario: Register with a 1-character password shows validation error
    Given I navigate to the registration page
    When I fill in registration details with a 1-character password
    And I agree to the privacy policy
    And I submit the registration form
    Then I should see a password length validation error

  # TC06 - Positive / Smoke
  @smoke @positive @TC06
  Scenario: Login with valid credentials redirects to account dashboard
    Given I navigate to the login page
    When I enter valid credentials and submit
    Then I should be redirected to the My Account dashboard

  # TC07 - Negative
  @negative @TC07
  Scenario: Login with wrong password shows error warning
    Given I navigate to the login page
    When I enter a valid email with an incorrect password
    Then I should see a warning containing "No match for E-Mail Address and/or Password"

  # TC08 - Negative
  @negative @TC08
  Scenario: Login lockout after more than 4 failed attempts
    Given I navigate to the login page
    When I attempt to login with wrong credentials 5 times
    Then I should see an account locked or exceeded attempts warning

  # TC09 - Positive
  @positive @TC09
  Scenario: Logout ends session and shows confirmation
    Given I am logged in as a registered user
    When I click logout
    Then I should see the logout confirmation page

  # TC27 - Functional
  @functional @TC27
  Scenario: Update account first name and confirm it is saved
    Given I am logged in as a registered user
    When I update my first name to "UpdatedName"
    Then I should see a success confirmation message

  # TC28 - Functional
  @functional @TC28
  Scenario: Toggle newsletter subscription preference
    Given I am logged in as a registered user
    When I set my newsletter preference to subscribed
    Then I should see a success confirmation message
