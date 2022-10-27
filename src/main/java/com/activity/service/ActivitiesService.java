package com.activity.service;

import com.activity.domain.Activities;
import com.activity.repository.ActivitiesRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ActivitiesService {

    private final Logger log = LoggerFactory.getLogger(ActivitiesService.class);

    private final ActivitiesRepository activitiesRepository;

    public ActivitiesService(ActivitiesRepository activitiesRepository) {
        this.activitiesRepository = activitiesRepository;
    }

    public Activities save(Activities activities) {
        log.debug("Start save activities: {}", activities);
        return activitiesRepository.save(activities);
    }

    public Activities updateActivities(Activities activities) {
        log.debug("Start update activities: {}", activities);
        return activitiesRepository.save(activities);
    }

    public Optional<Activities> partialUpdateActivities(Activities activities) {
        log.debug("Start partial update Activities: {}", activities);
        return activitiesRepository
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
    }

    public List<Activities> getAllActivities() {
        return this.calculateDelayTime();
    }

    public Optional<Activities> getActivities(Long id) {
        return activitiesRepository.findById(id);
    }

    public void deleteActivities(Long id) {
        log.debug("Star delete activitis: {}", id);
        activitiesRepository.deleteById(id);
    }

    public Boolean existsById(Long id) {
        return activitiesRepository.existsById(id);
    }

    private List<Activities> calculateDelayTime() {
        return activitiesRepository
            .findAll()
            .stream()
            .map(
                activities -> {
                    Date now = new Date();
                    activities.setDaysLate(daysBetweenTwoCloses(Date.from(activities.getTerminationDate()), now));
                    return partialUpdateActivities(activities).orElse(activities);
                }
            )
            .collect(Collectors.toList());
    }

    public static int daysBetweenTwoCloses(Date fechaDesde, Date fechaHasta) {
        long startTime = fechaDesde.getTime();
        long endTime = fechaHasta.getTime();
        long diasDesde = (long) Math.floor(startTime / (1000 * 60 * 60 * 24));
        long diasHasta = (long) Math.floor(endTime / (1000 * 60 * 60 * 24));
        return (int) (diasHasta - diasDesde);
    }
}
