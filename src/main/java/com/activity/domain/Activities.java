package com.activity.domain;

import com.activity.domain.enumeration.Status;
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
 * A Activities.
 */
@Entity
@Table(name = "activities")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Activities implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "detalle")
    private String detalle;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "termination_date")
    private Instant terminationDate;

    @Column(name = "days_late")
    private Integer daysLate;

    @OneToMany(mappedBy = "activities")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activities" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Activities id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Activities name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetalle() {
        return this.detalle;
    }

    public Activities detalle(String detalle) {
        this.detalle = detalle;
        return this;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public Status getStatus() {
        return this.status;
    }

    public Activities status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getTerminationDate() {
        return this.terminationDate;
    }

    public Activities terminationDate(Instant terminationDate) {
        this.terminationDate = terminationDate;
        return this;
    }

    public void setTerminationDate(Instant terminationDate) {
        this.terminationDate = terminationDate;
    }

    public Integer getDaysLate() {
        return this.daysLate;
    }

    public Activities daysLate(Integer daysLate) {
        this.daysLate = daysLate;
        return this;
    }

    public void setDaysLate(Integer daysLate) {
        this.daysLate = daysLate;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public Activities employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Activities addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setActivities(this);
        return this;
    }

    public Activities removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setActivities(null);
        return this;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setActivities(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setActivities(this));
        }
        this.employees = employees;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Activities)) {
            return false;
        }
        return id != null && id.equals(((Activities) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Activities{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", detalle='" + getDetalle() + "'" +
            ", status='" + getStatus() + "'" +
            ", terminationDate='" + getTerminationDate() + "'" +
            ", daysLate=" + getDaysLate() +
            "}";
    }
}
