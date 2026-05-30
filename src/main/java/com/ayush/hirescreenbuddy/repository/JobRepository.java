// JobRepository.java
package com.ayush.hirescreenbuddy.repository;
import com.ayush.hirescreenbuddy.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
public interface JobRepository extends JpaRepository<JobDescription, Long> {}