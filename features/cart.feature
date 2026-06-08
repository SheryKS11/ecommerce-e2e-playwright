@cart
Feature: Shopping Cart
  As a shopper
  I want to manage items in my cart
  So that I can review and adjust my order before checkout

  # TC15 - Positive / Smoke
  @smoke @positive @TC15
  Scenario: Add a product to the cart from the listing page
    Given I navigate to the home page
    When I search for "iPhone"
    And I click on the first product result
    And I add the product to the cart
    Then I should see a success alert containing "Success: You have added"

  # TC16 - Negative
  @negative @TC16
  Scenario: Adding a product with a missing required option shows a validation prompt
    Given I navigate to a product page that requires an option selection
    When I attempt to add the product to the cart without selecting a required option
    Then a validation prompt should appear for the required option

  # TC17 - Functional
  @functional @TC17
  Scenario: Updating cart quantity to 3 recalculates the line total
    Given I have a product in my cart
    When I update the quantity to 3
    Then the line total should reflect the updated quantity

  # TC18 - Boundary
  @boundary @TC18
  Scenario: Setting cart quantity to 0 removes or handles gracefully
    Given I have a product in my cart
    When I update the quantity to 0
    Then the cart should handle the value gracefully

  # TC19 - Functional
  @functional @TC19
  Scenario: Removing an item from the cart updates totals
    Given I have a product in my cart
    When I remove the item from the cart
    Then the cart should be empty

  # TC25 - Negative
  @negative @TC25
  Scenario: Applying an invalid coupon code shows a warning
    Given I have a product in my cart
    When I apply the coupon code "FAKECOUPON999"
    Then I should see a warning containing "Coupon is either invalid"
