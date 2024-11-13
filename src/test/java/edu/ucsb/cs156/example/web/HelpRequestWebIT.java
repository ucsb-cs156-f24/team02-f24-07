package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_helprequest() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();


        page.getByText("Create Help Request").click();
        assertThat(page.getByText("Create New Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("john@gmail.com");
        page.getByTestId("HelpRequestForm-teamId").fill("02");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
        page.getByTestId("HelpRequestForm-requestTime").fill("2022-01-02T12:00");
        page.getByTestId("HelpRequestForm-explanation").fill("need helps");
        page.getByTestId("HelpRequestForm-solved").check();
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestsTable-cell-row-0-col-teamId"))
                .hasText("02");

        page.getByTestId("HelpRequestsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-teamId").fill("04");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestsTable-cell-row-0-col-teamId")).hasText("04");

        page.getByTestId("HelpRequestsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequest-cell-row-0-col-teamId")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helprequest() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestsTable-cell-row-0-col-teamId")).not().isVisible();
    }
}