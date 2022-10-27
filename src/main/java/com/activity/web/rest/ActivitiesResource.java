package com.activity.web.rest;

import com.activity.domain.Activities;
import com.activity.repository.ActivitiesRepository;
import com.activity.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.activity.domain.Activities}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivitiesResource {

    private final Logger log = LoggerFactory.getLogger(ActivitiesResource.class);

    private static final String ENTITY_NAME = "activities";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivitiesRepository activitiesRepository;

    public ActivitiesResource(ActivitiesRepository activitiesRepository) {
        this.activitiesRepository = activitiesRepository;
    }

    /**
     * {@code POST  /activities} : Create a new activities.
     *
     * @param activities the activities to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activities, or with status {@code 400 (Bad Request)} if the activities has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activities")
    public ResponseEntity<Activities> createActivities(@Valid @RequestBody Activities activities) throws URISyntaxException {
        log.debug("REST request to save Activities : {}", activities);
        if (activities.getId() != null) {
            throw new BadRequestAlertException("A new activities cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Activities result = activitiesRepository.save(activities);
        return ResponseEntity
            .created(new URI("/api/activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activities/:id} : Updates an existing activities.
     *
     * @param id the id of the activities to save.
     * @param activities the activities to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activities,
     * or with status {@code 400 (Bad Request)} if the activities is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activities couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activities/{id}")
    public ResponseEntity<Activities> updateActivities(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Activities activities
    ) throws URISyntaxException {
        log.debug("REST request to update Activities : {}, {}", id, activities);
        if (activities.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activities.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Activities result = activitiesRepository.save(activities);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activities.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activities/:id} : Partial updates given fields of an existing activities, field will ignore if it is null
     *
     * @param id the id of the activities to save.
     * @param activities the activities to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activities,
     * or with status {@code 400 (Bad Request)} if the activities is not valid,
     * or with status {@code 404 (Not Found)} if the activities is not found,
     * or with status {@code 500 (Internal Server Error)} if the activities couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activities/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Activities> partialUpdateActivities(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Activities activities
    ) throws URISyntaxException {
        log.debug("REST request to partial update Activities partially : {}, {}", id, activities);
        if (activities.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activities.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Activities> result = activitiesRepository
            .findById(activities.getId())
            .map(
                existingActivities -> {
                    if (activities.getName() != null) {
                        existingActivities.setName(activities.getName());
                    }
                    if (activities.getDetalle() != null) {
                        existingActivities.setDetalle(activities.getDetalle());
                    }
                    if (activities.getStatus() != null) {
                        existingActivities.setStatus(activities.getStatus());
                    }
                    if (activities.getTerminationDate() != null) {
                        existingActivities.setTerminationDate(activities.getTerminationDate());
                    }
                    if (activities.getDaysLate() != null) {
                        existingActivities.setDaysLate(activities.getDaysLate());
                    }

                    return existingActivities;
                }
            )
            .map(activitiesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activities.getId().toString())
        );
    }

    /**
     * {@code GET  /activities} : get all the activities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activities in body.
     */
    @GetMapping("/activities")
    public List<Activities> getAllActivities() {
        log.debug("REST request to get all Activities");
        return activitiesRepository.findAll();
    }

    /**
     * {@code GET  /activities/:id} : get the "id" activities.
     *
     * @param id the id of the activities to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activities, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activities/{id}")
    public ResponseEntity<Activities> getActivities(@PathVariable Long id) {
        log.debug("REST request to get Activities : {}", id);
        Optional<Activities> activities = activitiesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activities);
    }

    /**
     * {@code DELETE  /activities/:id} : delete the "id" activities.
     *
     * @param id the id of the activities to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivities(@PathVariable Long id) {
        log.debug("REST request to delete Activities : {}", id);
        activitiesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
