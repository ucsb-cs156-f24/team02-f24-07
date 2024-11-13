package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        UCSBOrganizationRepository organizationRepository;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                UCSBOrganization organization = UCSBOrganization.builder()
							.orgCode("KRC")
							.orgTranslationShort("KOREAN RADIO CL")
							.orgTranslation("KOREAN RADIO CLUB")
							.inactive(true)
                            .build();
                                
				organizationRepository.save(organization);

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganization?orgCode=KRC"))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(organization);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_organization() throws Exception {
                // arrange

                UCSBOrganization organization1 = UCSBOrganization.builder()
								.orgCode("OSLI")
								.orgTranslationShort("STUDENT LIFE")
								.orgTranslation("OFFICE OF STUDENT LIFE")
								.inactive(true)
                                .build();

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/ucsborganization/post?orgCode=OSLI&orgTranslationShort=STUDENT LIFE&orgTranslation=OFFICE OF STUDENT LIFE&inactive=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(organization1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

		@WithMockUser(roles = { "ADMIN", "USER" })
		@Test
		public void admin_cannot_edit_organization_that_does_not_exist() throws Exception {
			// arrange

			UCSBOrganization zprEdited = UCSBOrganization.builder()
								.orgCode("ZPR")
								.orgTranslationShort("ZETA PHI RHO")
								.orgTranslation("ZETA PHI RHO at UCSB")
								.inactive(true)
								.build();

			String requestBody = mapper.writeValueAsString(zprEdited);

			// act
			MvcResult response = mockMvc.perform(
							put("/api/ucsborganization?orgCode=ZPR")
											.contentType(MediaType.APPLICATION_JSON)
											.characterEncoding("utf-8")
											.content(requestBody)
											.with(csrf()))
							.andExpect(status().isNotFound()).andReturn();

			// assert
			// System.out.println("LDResponse: " + response);
			String responseString = mapper.readTree(response.getResponse().getContentAsString()).get("message").toString();
			assertEquals("\"UCSBOrganization with id ZPR not found\"", responseString);
		}
}
