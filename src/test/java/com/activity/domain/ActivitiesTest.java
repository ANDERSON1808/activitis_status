package com.activity.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.activity.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActivitiesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Activities.class);
        Activities activities1 = new Activities();
        activities1.setId(1L);
        Activities activities2 = new Activities();
        activities2.setId(activities1.getId());
        assertThat(activities1).isEqualTo(activities2);
        activities2.setId(2L);
        assertThat(activities1).isNotEqualTo(activities2);
        activities1.setId(null);
        assertThat(activities1).isNotEqualTo(activities2);
    }
}
