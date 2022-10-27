package com.activity.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.activity.IntegrationTest;
import com.activity.domain.Activities;
import com.activity.domain.enumeration.Status;
import com.activity.repository.ActivitiesRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ActivitiesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivitiesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DETALLE = "AAAAAAAAAA";
    private static final String UPDATED_DETALLE = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.FINISHED;
    private static final Status UPDATED_STATUS = Status.EARRING;

    private static final Instant DEFAULT_TERMINATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TERMINATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_DAYS_LATE = 1;
    private static final Integer UPDATED_DAYS_LATE = 2;

    private static final String ENTITY_API_URL = "/api/activities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivitiesMockMvc;

    private Activities activities;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Activities createEntity(EntityManager em) {
        Activities activities = new Activities()
            .name(DEFAULT_NAME)
            .detalle(DEFAULT_DETALLE)
            .status(DEFAULT_STATUS)
            .terminationDate(DEFAULT_TERMINATION_DATE)
            .daysLate(DEFAULT_DAYS_LATE);
        return activities;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Activities createUpdatedEntity(EntityManager em) {
        Activities activities = new Activities()
            .name(UPDATED_NAME)
            .detalle(UPDATED_DETALLE)
            .status(UPDATED_STATUS)
            .terminationDate(UPDATED_TERMINATION_DATE)
            .daysLate(UPDATED_DAYS_LATE);
        return activities;
    }

    @BeforeEach
    public void initTest() {
        activities = createEntity(em);
    }

    @Test
    @Transactional
    void createActivities() throws Exception {
        int databaseSizeBeforeCreate = activitiesRepository.findAll().size();
        // Create the Activities
        restActivitiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isCreated());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeCreate + 1);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivities.getDetalle()).isEqualTo(DEFAULT_DETALLE);
        assertThat(testActivities.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testActivities.getTerminationDate()).isEqualTo(DEFAULT_TERMINATION_DATE);
        assertThat(testActivities.getDaysLate()).isEqualTo(DEFAULT_DAYS_LATE);
    }

    @Test
    @Transactional
    void createActivitiesWithExistingId() throws Exception {
        // Create the Activities with an existing ID
        activities.setId(1L);

        int databaseSizeBeforeCreate = activitiesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivitiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activitiesRepository.findAll().size();
        // set the field null
        activities.setName(null);

        // Create the Activities, which fails.

        restActivitiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isBadRequest());

        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        // Get all the activitiesList
        restActivitiesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activities.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].detalle").value(hasItem(DEFAULT_DETALLE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].terminationDate").value(hasItem(DEFAULT_TERMINATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].daysLate").value(hasItem(DEFAULT_DAYS_LATE)));
    }

    @Test
    @Transactional
    void getActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        // Get the activities
        restActivitiesMockMvc
            .perform(get(ENTITY_API_URL_ID, activities.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activities.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.detalle").value(DEFAULT_DETALLE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.terminationDate").value(DEFAULT_TERMINATION_DATE.toString()))
            .andExpect(jsonPath("$.daysLate").value(DEFAULT_DAYS_LATE));
    }

    @Test
    @Transactional
    void getNonExistingActivities() throws Exception {
        // Get the activities
        restActivitiesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();

        // Update the activities
        Activities updatedActivities = activitiesRepository.findById(activities.getId()).get();
        // Disconnect from session so that the updates on updatedActivities are not directly saved in db
        em.detach(updatedActivities);
        updatedActivities
            .name(UPDATED_NAME)
            .detalle(UPDATED_DETALLE)
            .status(UPDATED_STATUS)
            .terminationDate(UPDATED_TERMINATION_DATE)
            .daysLate(UPDATED_DAYS_LATE);

        restActivitiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivities.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivities))
            )
            .andExpect(status().isOk());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivities.getDetalle()).isEqualTo(UPDATED_DETALLE);
        assertThat(testActivities.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testActivities.getTerminationDate()).isEqualTo(UPDATED_TERMINATION_DATE);
        assertThat(testActivities.getDaysLate()).isEqualTo(UPDATED_DAYS_LATE);
    }

    @Test
    @Transactional
    void putNonExistingActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activities.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activities))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activities))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivitiesWithPatch() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();

        // Update the activities using partial update
        Activities partialUpdatedActivities = new Activities();
        partialUpdatedActivities.setId(activities.getId());

        partialUpdatedActivities.terminationDate(UPDATED_TERMINATION_DATE);

        restActivitiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivities.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivities))
            )
            .andExpect(status().isOk());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivities.getDetalle()).isEqualTo(DEFAULT_DETALLE);
        assertThat(testActivities.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testActivities.getTerminationDate()).isEqualTo(UPDATED_TERMINATION_DATE);
        assertThat(testActivities.getDaysLate()).isEqualTo(DEFAULT_DAYS_LATE);
    }

    @Test
    @Transactional
    void fullUpdateActivitiesWithPatch() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();

        // Update the activities using partial update
        Activities partialUpdatedActivities = new Activities();
        partialUpdatedActivities.setId(activities.getId());

        partialUpdatedActivities
            .name(UPDATED_NAME)
            .detalle(UPDATED_DETALLE)
            .status(UPDATED_STATUS)
            .terminationDate(UPDATED_TERMINATION_DATE)
            .daysLate(UPDATED_DAYS_LATE);

        restActivitiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivities.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivities))
            )
            .andExpect(status().isOk());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivities.getDetalle()).isEqualTo(UPDATED_DETALLE);
        assertThat(testActivities.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testActivities.getTerminationDate()).isEqualTo(UPDATED_TERMINATION_DATE);
        assertThat(testActivities.getDaysLate()).isEqualTo(UPDATED_DAYS_LATE);
    }

    @Test
    @Transactional
    void patchNonExistingActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activities.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activities))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activities))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();
        activities.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitiesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activities))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        int databaseSizeBeforeDelete = activitiesRepository.findAll().size();

        // Delete the activities
        restActivitiesMockMvc
            .perform(delete(ENTITY_API_URL_ID, activities.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
