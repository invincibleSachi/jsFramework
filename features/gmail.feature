#features/gmail.feature
Feature: Running Cucumber with Protractor
    As a user of Protractor
    I should be able to use Cucumber
    In order to run my E2E tests

@Sprint111
    Scenario: I enter the valid email id and valid password then I am able to get my mail box
        Given I login as User "asadasfs" and password "asdasfasedase"
        Then I see my mailbox