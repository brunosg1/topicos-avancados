package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.PragaDTO;
import br.edu.utfpr.api.dto.PragaResponseDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Praga;
import br.edu.utfpr.api.repository.CulturaRepository;
import br.edu.utfpr.api.repository.PragaRepository;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/pragas", produces = "application/json")
public class PragaController {

    @Autowired
    private PragaRepository pragaRepository;

    @Autowired
    private CulturaRepository culturaRepository;

    @GetMapping({"", "/"})
    public ResponseEntity<List<PragaResponseDTO>> getAll(@RequestParam(required = false) Long id) {
        List<Praga> pragas;

        if (id == null) {
            pragas = pragaRepository.findAllWithCulturas();
        } else {
            pragas = pragaRepository.findByIDWithCulturas(id);
        }

        if (pragas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        List<PragaResponseDTO> dtos = pragas.stream()
                                            .map(PragaResponseDTO::new)
                                            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PragaResponseDTO> getById(@PathVariable Long id) {
        Praga praga = pragaRepository.findById(id)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada"));

        PragaResponseDTO dto = new PragaResponseDTO(praga);
        return ResponseEntity.ok(dto);
    }

    @PutMapping({"", "/"})
    public ResponseEntity<Praga> put(@RequestBody @Valid PragaDTO pragaDTO) {
        Optional<Praga> pragaExistente = pragaRepository.findById(pragaDTO.id);

        if (pragaExistente.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        List<Cultura> culturas = pragaDTO.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Praga praga = pragaExistente.get();
        praga.setNome(pragaDTO.nome);
        praga.setNomeCientifico(pragaDTO.nomeCientifico);
        praga.setDescricao(pragaDTO.descricao);
        praga.setCulturasAfetadas(culturas);
        praga.setUpdateDate(LocalDateTime.now());

        Praga salva = pragaRepository.save(praga);
        return ResponseEntity.ok(salva);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Praga> post(@RequestBody @Valid PragaDTO p) {
        List<Cultura> culturas = p.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Praga praga = new Praga();
        praga.setNome(p.nome);
        praga.setDescricao(p.descricao);
        praga.setNomeCientifico(p.nomeCientifico);
        praga.setCulturasAfetadas(culturas);
        praga.setCreationDate(LocalDateTime.now());

        Praga salva = pragaRepository.save(praga);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable long id) {
        Optional<Praga> praga = pragaRepository.findById(id);

        if (praga.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Praga não encontrada");
        }

        pragaRepository.delete(praga.get());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Praga erradicada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
