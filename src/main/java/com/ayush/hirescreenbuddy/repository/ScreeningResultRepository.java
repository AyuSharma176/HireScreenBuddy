// ScreeningResultRepository.java
package com.ayush.hirescreenbuddy.repository;
import com.ayush.hirescreenbuddy.model.ScreeningResult;
import com.ayush.hirescreenbuddy.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ScreeningResultRepository extends JpaRepository<ScreeningResult, Long> {
    List<ScreeningResult> findByJobOrderByScoreDesc(JobDescription job);
}