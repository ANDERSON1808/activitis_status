package com.activity.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "created")
    private Instant created;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee" }, allowSetters = true)
    private Set<Activities> activities = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Employee name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreated() {
        return this.created;
    }

    public Employee created(Instant created) {
        this.created = created;
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public Set<Activities> getActivities() {
        return this.activities;
    }

    public Employee activities(Set<Activities> activities) {
        this.setActivities(activities);
        return this;
    }

    public Employee addActivities(Activities activities) {
        this.activities.add(activities);
        activities.setEmployee(this);
        return this;
    }

    public Employee removeActivities(Activities activities) {
        this.activities.remove(activities);
        activities.setEmployee(null);
        return this;
    }

    public void setActivities(Set<Activities> activities) {
        if (this.activities != null) {
            this.activities.forEach(i -> i.setEmployee(null));
        }
        if (activities != null) {
            activities.forEach(i -> i.setEmployee(this));
        }
        this.activities = activities;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
