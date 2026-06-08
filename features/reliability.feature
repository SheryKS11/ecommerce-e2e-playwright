@reliability
Feature: Cross-Browser Compatibility and Wait-Strategy Reliability
  As a QA engineer
  I want to verify consistent behaviour across browsers
  So that I can demonstrate the difference between robust auto-waiting and a fixed-sleep anti-pattern

  # TC29 - Compatibility
  @compatibility @TC29
  Scenario: Home page loads on all major browsers
    Given I navigate to the home page
    Then the page title should contain "Your Store"
    And the search input should be visible

  # TC30 - Reliability — GOOD wait strategy (stable)
  @reliability @TC30 @good-wait
  Scenario: Auto-waiting strategy - product search is stable using web-first assertions
    Given I navigate to the home page
    When I search for "iPhone"
    Then the search results page should display matching products using auto-waiting assertions

  # TC30 - Reliability — fixed-sleep anti-pattern (deterministic failure for demonstration)
  @reliability @TC30 @bad-wait
  Scenario: Fixed-sleep anti-pattern - product search fails deterministically with a hard-coded wait
    Given I navigate to the home page
    When I search for "iPhone"
    Then the search results page should display matching products using a fixed sleep
