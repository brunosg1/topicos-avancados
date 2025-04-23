package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.DoencaDTO;
import br.edu.utfpr.api.dto.DoencaResponseDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Doenca;
import br.edu.utfpr.api.repository.CulturaRepository;
import br.edu.utfpr.api.repository.DoencaRepository;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/doencas", produces = "application/json")
public class DoencaController {

    @Autowired
    private DoencaRepository doencaRepository;

    @Autowired
    private CulturaRepository culturaRepository;

    @GetMapping
    public ResponseEntity<List<DoencaResponseDTO>> get(@RequestParam(required = false) String nome) {
        List<Doenca> doencas;

        if (nome == null || nome.isEmpty()) {
            doencas = doencaRepository.findAllWithCulturas();
        } else {
            doencas = doencaRepository.findByNomeIgnoreCaseWithCulturas(nome);
        }

        if (doencas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        List<DoencaResponseDTO> dtos = doencas.stream()
                                              .map(DoencaResponseDTO::new)
                                              .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping({"", "/"})
    public ResponseEntity<Doenca> put(@RequestBody DoencaDTO doencaDTO) {
        Optional<Doenca> doencaExistente = doencaRepository.findById(doencaDTO.id);

        if (doencaExistente.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        List<Cultura> culturas = doencaDTO.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Doenca doenca = doencaExistente.get();
        doenca.setNome(doencaDTO.nome);
        doenca.setSintomas(doencaDTO.sintomas);
        doenca.setTratamentos(doencaDTO.tratamentos);
        doenca.setCulturasAfetadas(culturas);
        doenca.setUpdateDate(LocalDateTime.now());

        Doenca atualizada = doencaRepository.save(doenca);
        return ResponseEntity.ok(atualizada);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Doenca> post(@RequestBody DoencaDTO p) {
        List<Cultura> culturas = p.culturasAfetadas.stream()
            .map(id -> culturaRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura com ID " + id + " não encontrada")))
            .collect(Collectors.toList());

        Doenca doenca = new Doenca();
        doenca.setNome(p.nome);
        doenca.setSintomas(p.sintomas);
        doenca.setTratamentos(p.tratamentos);
        doenca.setCulturasAfetadas(culturas);
        doenca.setCreationDate(LocalDateTime.now());

        Doenca salva = doencaRepository.save(doenca);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> delete(@RequestParam long id) {
        Optional<Doenca> doenca = doencaRepository.findById(id);

        if (doenca.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }

        doencaRepository.delete(doenca.get());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Doença erradicada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
