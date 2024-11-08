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
public class ArticleWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByTestId("ArticleForm-title").fill("Breaking News");
        page.getByTestId("ArticleForm-url").fill("https://example.com");
        page.getByTestId("ArticleForm-explanation").fill("Something has happened!");
        page.getByTestId("ArticleForm-dateAdded").fill("2021-05-21T08:23");
        page.getByTestId("ArticleForm-email").fill("ramonwang@ucsb.edu");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title"))
                .hasText("Breaking News");

        page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticleForm-title").fill("Great News");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Great News");

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }
}