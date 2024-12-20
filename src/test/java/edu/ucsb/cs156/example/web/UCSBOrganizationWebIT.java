package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_organization() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organizations").click();

        page.getByText("Create Organization").click();
        assertThat(page.getByText("Create New Organization")).isVisible();
        page.getByTestId("OrganizationForm-orgCode").fill("ACM");
        page.getByTestId("OrganizationForm-orgTranslationShort").fill("ACM @ UCSB");
        page.getByTestId("OrganizationForm-orgTranslation").fill("Association for Computing Machinery @ UCSB");
        page.getByTestId("OrganizationForm-inactive").click();
        page.getByTestId("OrganizationForm-submit").click();

        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslationShort"))
                .hasText("ACM @ UCSB");

        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-inactive"))
                .hasText("true");

        page.getByTestId("OrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Organization")).isVisible();
        page.getByTestId("OrganizationForm-orgTranslationShort").fill("ACM");
        page.getByTestId("OrganizationForm-submit").click();

        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgTranslationShort")).hasText("ACM");

        page.getByTestId("OrganizationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_organization() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organizations").click();

        assertThat(page.getByText("Create Organization")).not().isVisible();
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}