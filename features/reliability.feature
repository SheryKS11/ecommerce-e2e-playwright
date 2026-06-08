@reliability
Feature: Cross-Browser Compatibility and Flakiness Control
  As a QA engineer
  I want to verify consistent behaviour across browsers
  So that I can demonstrate the difference between stable and flaky wait strategies

  # TC29 - Compatibility
  @compatibility @TC29
  Scenario: Home page loads on all major browsers
    Given I navigate to the home page
    Then the page title should contain "Your Store"
    And the search input should be visible

  # TC30 - Reliability — GOOD wait strategy (stable)
  @reliability @TC30 @good-wait
  Scenario: GOOD wait strategy - product search is stable using auto-waiting assertions
    Given I navigate to the home page
    When I search for "iPhone"
    Then the search results page should display matching products using auto-waiting assertions

  # TC30 - Reliability — BAD wait strategy (intentionally flaky for demonstration)
  @reliability @TC30 @bad-wait
  Scenario: BAD wait strategy - product search uses a fixed sleep that may be flaky
    Given I navigate to the home page
    When I search for "iPhone"
    Then the search results page should display matching products using a fixed sleep
