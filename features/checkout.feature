@checkout
Feature: Checkout
  As a shopper
  I want to complete the checkout process
  So that I can place an order successfully

  # TC22 - Positive / E2E / Smoke
  @smoke @e2e @positive @TC22
  Scenario: Guest checkout completes and shows order confirmation
    Given I have a product in my cart
    When I proceed to checkout as a guest
    And I fill in the guest billing details
    And I continue through shipping and payment steps
    And I confirm the order
    Then I should see the order confirmation page

  # TC23 - Positive / E2E
  @e2e @positive @TC23
  Scenario: Registered user checkout completes and shows order confirmation
    Given I am logged in as a registered user
    And I have a product in my cart
    When I proceed to checkout as a registered user
    And I fill in the billing details
    And I confirm the order
    Then I should see the order confirmation page

  # TC24 - Negative
  @negative @TC24
  Scenario: Checkout with blank required address fields blocks progression
    Given I have a product in my cart
    When I proceed to checkout as a guest
    And I submit the billing form with empty required fields
    Then validation should block progression to the next step
