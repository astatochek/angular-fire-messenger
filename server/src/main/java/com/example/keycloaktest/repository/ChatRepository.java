package com.example.keycloaktest.repository;

import java.util.List;
import java.util.Optional;

import com.example.keycloaktest.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {


    @Query("select t from Chat t  where (t.fParticipant=  :fParticipant"
            + " and t.sParticipant= :sParticipant) or (t.fParticipant= :sParticipant and "
            + "t.sParticipant= :fParticipant)")
    public Chat findByFParticipantOrSParticipant(@Param("fParticipant") String fParticipant,
                                                 @Param("sParticipant") String sParticipant);


    @Query("select t from Chat t where t.fParticipant= :id or t.sParticipant= :id")
    public List<Chat> getChats(@Param("id") String id);

    public Optional<Chat> findById(Long id);
}