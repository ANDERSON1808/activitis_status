package com.activity.repository;

import com.activity.domain.Activities;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Activities entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivitiesRepository extends JpaRepository<Activities, Long> {}
