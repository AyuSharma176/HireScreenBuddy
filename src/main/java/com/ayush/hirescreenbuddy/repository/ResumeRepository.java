// ResumeRepository.java
package com.ayush.hirescreenbuddy.repository;
import com.ayush.hirescreenbuddy.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResumeRepository extends JpaRepository<Resume, Long> {}