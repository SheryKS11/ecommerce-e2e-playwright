@catalogue
Feature: Catalogue - Search, Filter, Product Detail and Currency
  As a shopper
  I want to search and browse products
  So that I can find what I need and view product details

  # TC10 - Positive / Smoke
  @smoke @positive @TC10
  Scenario: Search for a valid product returns matching results
    Given I navigate to the home page
    When I search for "iPhone"
    Then the search results page should display matching products

  # TC11 - Negative
  @negative @TC11
  Scenario: Search for a non-existent product shows no results message
    Given I navigate to the home page
    When I search for "xyzabc123notaproduct"
    Then I should see the message "There is no product that matches the search criteria"

  # TC12 - Negative
  @negative @TC12
  Scenario: Submitting an empty search does not crash the page
    Given I navigate to the home page
    When I submit an empty search
    Then the page should load without errors

  # TC13 - Functional
  @functional @TC13
  Scenario: Sort search results by price low to high reorders products correctly
    Given I navigate to the home page
    When I search for "MacBook"
    And I sort results by "Price (Low > High)"
    Then the products should be displayed in ascending price order

  # TC14 - Positive / Smoke
  @smoke @positive @TC14
  Scenario: Opening a product card shows the product detail page
    Given I navigate to the home page
    When I search for "iPhone"
    And I click on the first product result
    Then the product detail page should show price, image, and options

  # TC26 - Functional
  @functional @TC26
  Scenario: Switching currency updates product prices
    Given I navigate to the home page
    When I switch the currency to "EUR"
    Then the displayed prices should reflect the selected currency
