@wishlist @compare
Feature: Wishlist and Product Compare
  As a logged-in shopper
  I want to save products to my wishlist and compare products
  So that I can make better purchase decisions

  # TC20 - Functional
  @functional @TC20
  Scenario: Add a product to the wishlist shows confirmation
    Given I am logged in as a registered user
    And I navigate to the home page
    When I search for "iPhone"
    And I click on the first product result
    And I add the product to my wishlist
    Then I should see a wishlist success confirmation

  # TC21 - Functional
  @functional @TC21
  Scenario: Add two products to compare and view comparison table
    Given I navigate to the home page
    When I search for "MacBook"
    And I add the first product to compare
    And I add the second product to compare
    And I open the compare page
    Then the comparison table should list at least 2 products
